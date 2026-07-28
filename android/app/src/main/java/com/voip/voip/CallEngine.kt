package com.voip.voip

import android.content.Context
import android.os.Handler
import android.os.HandlerThread
import com.voip.BuildConfig
import org.linphone.core.Account
import org.linphone.core.AccountParams
import org.linphone.core.AuthInfo
import org.linphone.core.AudioDevice
import org.linphone.core.Call
import org.linphone.core.Core
import org.linphone.core.CoreListenerStub
import org.linphone.core.Factory
import org.linphone.core.MediaEncryption
import org.linphone.core.Reason
import org.linphone.core.TransportType
import org.linphone.core.RegistrationState as LinphoneRegistrationState

/**
 * Single source of truth for call state, shared by VoipCallModule (the JS
 * bridge), VoipConnectionService (Android Telecom integration), and
 * IncomingCallActivity (the lock-screen UI) — so all three always agree on
 * what's happening, regardless of which one a user or the OS interacts with.
 *
 * Backed by liblinphone (org.linphone:linphone-sdk-android). Written by
 * cross-referencing the exact Kotlin API against the *current* linphone-android
 * app source (github.com/BelledonneCommunications/linphone-android, tag 6.2.3
 * — the version that was actually current when this was written; the sandbox
 * this was authored in cannot resolve maven.linphone.org to download the
 * binary SDK itself, but GitHub was reachable, so the API calls below are
 * checked against real, current, working code rather than memory alone. The
 * one thing that genuinely could not be verified: that the AAR pulled in by
 * the Gradle dependency below actually is 6.2.3's API surface — pin drift
 * between the app repo's tag and the published SDK artifact is the most
 * likely source of a compile error on first local build.
 *
 * The Core must be created and driven from one dedicated thread (confirmed by
 * how linphone-android's own CoreContext works — Core creation and every
 * Core/Call method call happens via a Handler bound to a HandlerThread's
 * Looper, not whatever thread happens to call in). React Native's native
 * module methods run on a bridge thread with no Looper of its own, so without
 * this, isAutoIterateEnabled's internal scheduling would be unreliable at
 * best. postToCoreThread() below is the equivalent of their postOnCoreThread().
 */
object CallEngine {
    enum class RegistrationState { NONE, PROGRESS, OK, FAILED }
    enum class CallState { RINGING, CONNECTING, CONNECTED, ENDED, ERROR }
    enum class CallDirection { INCOMING, OUTGOING }
    enum class Encryption { NONE, SRTP, ZRTP }

    data class ActiveCall(
        val callId: String,
        val direction: CallDirection,
        var state: CallState,
        val number: String,
        var encryption: Encryption = Encryption.NONE,
    )

    data class SipAccount(
        val registrar: String,
        val username: String,
        val password: String,
        val provider: String,
        // The actual purchased DID — distinct from `username`, which is just
        // the SIP credential's auth identifier. Telnyx/Twilio validate the
        // From/caller-ID on outbound INVITEs against numbers you actually own
        // on the account; presenting the SIP credential username there (e.g.
        // "user2026...") instead of the real number gets every outbound call
        // rejected with 403 "Caller Origination Number is Invalid" — a real,
        // confirmed rejection, not a hypothetical.
        val number: String,
    )

    interface Listener {
        fun onRegistrationStateChanged(state: RegistrationState, message: String?) {}
        fun onCallStateChanged(call: ActiveCall) {}
        fun onIncomingCall(call: ActiveCall) {}
    }

    private val listeners = mutableSetOf<Listener>()

    private lateinit var appContext: Context
    private var core: Core? = null
    private var linphoneAccount: Account? = null

    private val coreThreadHandlerThread by lazy { HandlerThread("VoipCoreThread").apply { start() } }
    private val coreHandler by lazy { Handler(coreThreadHandlerThread.looper) }

    // Telecom/JS only ever see our own callId strings (generated here); this
    // is the correlation table back to liblinphone's own Call objects. Only
    // ever touched from the core thread.
    private val callIdToLinphoneCall = mutableMapOf<String, Call>()
    private val linphoneCallToCallId = mutableMapOf<Call, String>()

    var account: SipAccount? = null
        private set
    var registrationState: RegistrationState = RegistrationState.NONE
        private set
    var currentCall: ActiveCall? = null
        private set

    fun addListener(listener: Listener) {
        listeners.add(listener)
    }

    fun removeListener(listener: Listener) {
        listeners.remove(listener)
    }

    /** Call once from VoipCallModule's constructor — the Core itself is created lazily on first register(). */
    fun init(context: Context) {
        appContext = context.applicationContext
    }

    private fun postToCoreThread(block: (core: Core) -> Unit) {
        coreHandler.post {
            block(ensureCoreStarted())
        }
    }

    private fun notifyRegistrationState(state: RegistrationState, message: String? = null) {
        registrationState = state
        listeners.forEach { it.onRegistrationStateChanged(state, message) }
    }

    private fun notifyCallState(call: ActiveCall) {
        currentCall = if (call.state == CallState.ENDED || call.state == CallState.ERROR) null else call
        listeners.forEach { it.onCallStateChanged(call) }
    }

    private fun mapEncryption(mediaEncryption: MediaEncryption?): Encryption = when (mediaEncryption) {
        MediaEncryption.ZRTP -> Encryption.ZRTP
        MediaEncryption.SRTP, MediaEncryption.DTLS -> Encryption.SRTP
        else -> Encryption.NONE
    }

    private fun mapLinphoneCallState(state: Call.State?): CallState = when (state) {
        Call.State.OutgoingInit, Call.State.OutgoingProgress, Call.State.OutgoingRinging, Call.State.OutgoingEarlyMedia -> CallState.CONNECTING
        Call.State.IncomingReceived, Call.State.IncomingEarlyMedia -> CallState.RINGING
        Call.State.Connected, Call.State.StreamsRunning -> CallState.CONNECTED
        Call.State.End, Call.State.Released -> CallState.ENDED
        Call.State.Error -> CallState.ERROR
        else -> CallState.CONNECTING
    }

    private val coreListener = object : CoreListenerStub() {
        override fun onAccountRegistrationStateChanged(
            core: Core,
            account: Account,
            state: LinphoneRegistrationState?,
            message: String
        ) {
            val mapped = when (state) {
                LinphoneRegistrationState.Ok -> RegistrationState.OK
                LinphoneRegistrationState.Progress -> RegistrationState.PROGRESS
                LinphoneRegistrationState.Failed -> RegistrationState.FAILED
                else -> RegistrationState.NONE
            }
            notifyRegistrationState(mapped, message)
        }

        override fun onCallStateChanged(core: Core, call: Call, state: Call.State?, message: String) {
            if (state == Call.State.IncomingReceived && !linphoneCallToCallId.containsKey(call)) {
                val callId = "call-${System.currentTimeMillis()}"
                callIdToLinphoneCall[callId] = call
                linphoneCallToCallId[call] = callId

                val number = call.remoteAddress?.asStringUriOnly() ?: ""
                val activeCall = ActiveCall(callId, CallDirection.INCOMING, CallState.RINGING, number)
                currentCall = activeCall
                listeners.forEach { it.onIncomingCall(activeCall) }
                notifyCallState(activeCall)
                return
            }

            val callId = linphoneCallToCallId[call] ?: return
            val mappedState = mapLinphoneCallState(state)
            val encryption = mapEncryption(call.currentParams?.mediaEncryption)
            val direction = if (call.dir == Call.Dir.Outgoing) CallDirection.OUTGOING else CallDirection.INCOMING
            val number = call.remoteAddress?.asStringUriOnly() ?: ""

            val activeCall = ActiveCall(callId, direction, mappedState, number, encryption)
            notifyCallState(activeCall)

            if (mappedState == CallState.ENDED || mappedState == CallState.ERROR) {
                callIdToLinphoneCall.remove(callId)
                linphoneCallToCallId.remove(call)
            }
        }
    }

    /** Must only be called from the core thread (postToCoreThread already guarantees this). */
    private fun ensureCoreStarted(): Core {
        core?.let { return it }

        if (BuildConfig.DEBUG) {
            Factory.instance().enableLogcatLogs(true)
            // enableLogcatLogs alone only surfaces Warning+ — the actual SIP
            // transaction detail (INVITE sent, response received, etc.) is
            // logged at Message/Debug level and was invisible without this.
            Factory.instance().loggingService.setLogLevel(org.linphone.core.LogLevel.Debug)
        }

        val config = Factory.instance().createConfig(null)
        val created = Factory.instance().createCoreWithConfig(config, appContext)
        created.addListener(coreListener)
        created.isAutoIterateEnabled = true
        created.start()
        core = created
        return created
    }

    fun register(account: SipAccount) {
        this.account = account
        notifyRegistrationState(RegistrationState.PROGRESS)

        postToCoreThread { core ->
            linphoneAccount?.let { existing ->
                core.removeAccount(existing)
                core.authInfoList.forEach { core.removeAuthInfo(it) }
            }

            // REGISTER's identity must stay the SIP credential username —
            // tried making this the real DID (so calls would present it as
            // caller ID) and that broke registration itself (403 Forbidden
            // from Telnyx on every REGISTER). The real DID is set per-call
            // instead, via CallParams.fromHeader in startCall() below.
            val identity = Factory.instance().createAddress("sip:${account.username}@${account.registrar}")
            val authInfo: AuthInfo = Factory.instance().createAuthInfo(
                account.username, account.username, account.password, null, null, account.registrar
            )
            core.addAuthInfo(authInfo)

            val accountParams: AccountParams = core.createAccountParams()
            accountParams.identityAddress = identity

            val serverAddress = Factory.instance().createAddress("sip:${account.registrar}")
            serverAddress?.transport = TransportType.Tls
            accountParams.serverAddress = serverAddress
            accountParams.isRegisterEnabled = true

            val newAccount = core.createAccount(accountParams)
            core.addAccount(newAccount)
            core.defaultAccount = newAccount
            linphoneAccount = newAccount
        }
    }

    fun unregister() {
        postToCoreThread { core ->
            linphoneAccount?.let {
                val disabledParams = it.params?.clone()
                if (disabledParams != null) {
                    disabledParams.isRegisterEnabled = false
                    it.params = disabledParams
                }
                core.removeAccount(it)
            }
            linphoneAccount = null
        }
        account = null
        notifyRegistrationState(RegistrationState.NONE)
    }

    fun startCall(number: String): String {
        val callId = "call-${System.currentTimeMillis()}"

        postToCoreThread { core ->
            val address = core.interpretUrl(number, true)
            if (address == null) {
                notifyCallState(ActiveCall(callId, CallDirection.OUTGOING, CallState.ERROR, number))
                return@postToCoreThread
            }

            val params = core.createCallParams(null)
            params?.mediaEncryption = MediaEncryption.ZRTP
            // Caller ID is set server-side (Telnyx: ani_override on the
            // Credential Connection; see telnyx.helper.js) rather than via
            // CallParams.fromHeader here — overriding the From per-call broke
            // the 401/407 auto-auth handshake, since Linphone couldn't match
            // the challenge back to the registered account's AuthInfo once
            // the From no longer matched the registered identity.
            val call = if (params != null) core.inviteAddressWithParams(address, params) else core.inviteAddress(address)

            if (call == null) {
                notifyCallState(ActiveCall(callId, CallDirection.OUTGOING, CallState.ERROR, number))
                return@postToCoreThread
            }

            callIdToLinphoneCall[callId] = call
            linphoneCallToCallId[call] = callId
        }

        val activeCall = ActiveCall(callId, CallDirection.OUTGOING, CallState.CONNECTING, number)
        notifyCallState(activeCall)
        return callId
    }

    // Retained only as the entry point for VoipCallModule.devSimulateIncomingCall's
    // debug-only test path — real incoming calls are driven by
    // coreListener.onCallStateChanged above, triggered by an actual SIP INVITE.
    fun notifyIncomingCall(number: String): String {
        val callId = "call-${System.currentTimeMillis()}"
        val call = ActiveCall(callId, CallDirection.INCOMING, CallState.RINGING, number)
        currentCall = call
        listeners.forEach { it.onIncomingCall(call) }
        notifyCallState(call)
        return callId
    }

    fun answerCall() {
        postToCoreThread { core -> core.currentCall?.accept() }
    }

    fun rejectCall() {
        postToCoreThread { core -> core.currentCall?.decline(Reason.Declined) }
    }

    fun hangUp() {
        postToCoreThread { core -> core.currentCall?.terminate() }
    }

    fun setMuted(muted: Boolean) {
        // A per-Call property, not a Core one — confirmed against
        // linphone-android's CurrentCallViewModel.toggleMuteMicrophone().
        postToCoreThread { core -> core.currentCall?.microphoneMuted = muted }
    }

    fun setSpeakerEnabled(enabled: Boolean) {
        postToCoreThread { core ->
            val call = core.currentCall ?: return@postToCoreThread
            val wantedType = if (enabled) AudioDevice.Type.Speaker else AudioDevice.Type.Earpiece
            val device = core.audioDevices.firstOrNull {
                it.type == wantedType && it.hasCapability(AudioDevice.Capabilities.CapabilityPlay)
            }
            if (device != null) {
                call.outputAudioDevice = device
            }
        }
    }

    fun sendDtmf(digit: Char) {
        postToCoreThread { core -> core.currentCall?.sendDtmf(digit) }
    }

    // ZRTP verification: liblinphone 5.2.x (confirmed directly against the
    // compiled Call.class — javap, not source guessing this time) exposes a
    // single shared SAS string (call.authenticationToken) that both ends
    // compute identically and compare aloud, not the newer 4-candidate-word
    // scheme later SDK releases introduced (that API — localAuthenticationToken/
    // remoteAuthenticationTokens — doesn't exist in this version; using it was
    // this file's one real mistake from cross-referencing a newer app release's
    // source than the SDK version this build actually resolves). Still a real,
    // meaningful MITM check: if a relay attacker is on the media path, the SAS
    // it computes won't match on both ends.
    data class EncryptionInfo(
        val encrypted: Boolean,
        val mechanism: String?,
        val sas: String?,
        val verified: Boolean,
    )

    fun getEncryptionInfo(callback: (EncryptionInfo) -> Unit) {
        postToCoreThread { core ->
            val call = core.currentCall
            val mediaEncryption = call?.currentParams?.mediaEncryption
            val result = if (call == null || mediaEncryption == null || mediaEncryption == MediaEncryption.None) {
                EncryptionInfo(encrypted = false, mechanism = null, sas = null, verified = false)
            } else {
                val mechanism = if (mediaEncryption == MediaEncryption.ZRTP) "zrtp" else "srtp"
                EncryptionInfo(
                    encrypted = true,
                    mechanism = mechanism,
                    sas = call.authenticationToken,
                    verified = call.authenticationTokenVerified
                )
            }
            callback(result)
        }
    }

    fun confirmSasVerified(verified: Boolean) {
        postToCoreThread { core -> core.currentCall?.authenticationTokenVerified = verified }
    }
}
