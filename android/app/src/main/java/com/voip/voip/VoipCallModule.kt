package com.voip.voip

import android.net.Uri
import android.os.Bundle
import android.telecom.TelecomManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.voip.BuildConfig

class VoipCallModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "VoipCallModule"

    private val engineListener = object : CallEngine.Listener {
        override fun onRegistrationStateChanged(state: CallEngine.RegistrationState, message: String?) {
            val map = Arguments.createMap()
            map.putString("provider", CallEngine.account?.provider)
            map.putString("state", state.name.lowercase())
            map.putString("message", message)
            emit("RegistrationStateChanged", map)
        }

        override fun onCallStateChanged(call: CallEngine.ActiveCall) {
            emit("CallStateChanged", callToMap(call))
        }

        override fun onIncomingCall(call: CallEngine.ActiveCall) {
            emit("IncomingCall", callToMap(call))

            val telecomManager = reactContext.getSystemService(TelecomManager::class.java)
            val extras = Bundle()
            extras.putString(EXTRA_CALL_ID, call.callId)
            extras.putParcelable(TelecomManager.EXTRA_INCOMING_CALL_ADDRESS, Uri.fromParts("tel", call.number, null))
            telecomManager?.addNewIncomingCall(PhoneAccountHelper.getHandle(reactContext), extras)
        }
    }

    init {
        CallEngine.init(reactContext)
        CallEngine.addListener(engineListener)
    }

    private fun callToMap(call: CallEngine.ActiveCall): WritableMap {
        val map = Arguments.createMap()
        map.putString("callId", call.callId)
        map.putString("direction", call.direction.name.lowercase())
        map.putString("state", call.state.name.lowercase())
        map.putString("number", call.number)
        map.putString("encryption", call.encryption.name.lowercase())
        return map
    }

    private fun emit(eventName: String, data: WritableMap) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }

    // Required by RN's NativeEventEmitter even when nothing needs to hook the
    // native listener-count lifecycle.
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}

    @ReactMethod
    fun register(registrar: String, username: String, password: String, provider: String, number: String, promise: Promise) {
        try {
            PhoneAccountHelper.register(reactContext)
            CallEngine.register(CallEngine.SipAccount(registrar, username, password, provider, number))
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("register_failed", e.message, e)
        }
    }

    @ReactMethod
    fun unregister(promise: Promise) {
        CallEngine.unregister()
        promise.resolve(null)
    }

    @ReactMethod
    fun startCall(number: String, promise: Promise) {
        try {
            val callId = CallEngine.startCall(number)

            val callExtras = Bundle()
            callExtras.putString(EXTRA_CALL_ID, callId)

            val extras = Bundle()
            extras.putParcelable(TelecomManager.EXTRA_PHONE_ACCOUNT_HANDLE, PhoneAccountHelper.getHandle(reactContext))
            extras.putBundle(TelecomManager.EXTRA_OUTGOING_CALL_EXTRAS, callExtras)

            val telecomManager = reactContext.getSystemService(TelecomManager::class.java)
            telecomManager?.placeCall(Uri.fromParts("tel", number, null), extras)

            promise.resolve(callId)
        } catch (e: Exception) {
            promise.reject("start_call_failed", e.message, e)
        }
    }

    @ReactMethod
    fun answerCall(promise: Promise) {
        CallEngine.answerCall()
        promise.resolve(null)
    }

    @ReactMethod
    fun rejectCall(promise: Promise) {
        CallEngine.rejectCall()
        promise.resolve(null)
    }

    @ReactMethod
    fun hangUp(promise: Promise) {
        CallEngine.hangUp()
        promise.resolve(null)
    }

    @ReactMethod
    fun setMuted(muted: Boolean, promise: Promise) {
        CallEngine.setMuted(muted)
        promise.resolve(null)
    }

    @ReactMethod
    fun setSpeakerEnabled(enabled: Boolean, promise: Promise) {
        CallEngine.setSpeakerEnabled(enabled)
        promise.resolve(null)
    }

    @ReactMethod
    fun sendDtmf(digit: String, promise: Promise) {
        if (digit.isNotEmpty()) {
            CallEngine.sendDtmf(digit[0])
        }
        promise.resolve(null)
    }

    @ReactMethod
    fun getEncryptionInfo(promise: Promise) {
        CallEngine.getEncryptionInfo { info ->
            val map = Arguments.createMap()
            map.putBoolean("encrypted", info.encrypted)
            map.putString("mechanism", info.mechanism)
            map.putString("sas", info.sas)
            map.putBoolean("verified", info.verified)
            promise.resolve(map)
        }
    }

    @ReactMethod
    fun confirmSasVerified(verified: Boolean, promise: Promise) {
        CallEngine.confirmSasVerified(verified)
        promise.resolve(null)
    }

    // Debug-only: lets the incoming-call path (IncomingCallActivity, Telecom
    // routing, answer/reject) be exercised on a device with no real SIP
    // traffic. No-ops in release builds.
    @ReactMethod
    fun devSimulateIncomingCall(number: String, promise: Promise) {
        if (!BuildConfig.DEBUG) {
            promise.reject("unavailable", "devSimulateIncomingCall is debug-only")
            return
        }
        CallEngine.notifyIncomingCall(number)
        promise.resolve(null)
    }
}
