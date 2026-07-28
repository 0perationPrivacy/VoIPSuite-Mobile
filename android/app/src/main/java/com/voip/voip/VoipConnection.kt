package com.voip.voip

import android.net.Uri
import android.telecom.Connection
import android.telecom.DisconnectCause
import android.telecom.TelecomManager

/**
 * Telecom's handle on one call. Android calls onAnswer()/onReject()/onDisconnect()
 * here in response to Bluetooth headset buttons, Android Auto, a wearable, or
 * our own IncomingCallActivity/in-call screen going through TelecomManager —
 * so this is the one place all of those converge on CallEngine, regardless of
 * which surface the user actually used.
 */
class VoipConnection(private val callId: String) : Connection() {

    init {
        connectionProperties = PROPERTY_SELF_MANAGED
        connectionCapabilities = CAPABILITY_MUTE
        audioModeIsVoip = true
    }

    fun setNumber(number: String) {
        setAddress(Uri.fromParts("tel", number, null), TelecomManager.PRESENTATION_ALLOWED)
    }

    override fun onAnswer() {
        CallEngine.answerCall()
        setActive()
    }

    override fun onReject() {
        CallEngine.rejectCall()
        setDisconnected(DisconnectCause(DisconnectCause.REJECTED))
        destroy()
    }

    override fun onDisconnect() {
        CallEngine.hangUp()
        setDisconnected(DisconnectCause(DisconnectCause.LOCAL))
        destroy()
    }

    override fun onAbort() {
        CallEngine.hangUp()
        setDisconnected(DisconnectCause(DisconnectCause.CANCELED))
        destroy()
    }

    override fun onStateChanged(state: Int) {
        super.onStateChanged(state)
    }

    companion object {
        // Keyed by CallEngine's callId so VoipConnectionService can look a
        // connection back up when CallEngine reports a state change.
        val active = mutableMapOf<String, VoipConnection>()
    }
}
