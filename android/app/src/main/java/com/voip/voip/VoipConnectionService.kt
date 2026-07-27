package com.voip.voip

import android.telecom.Connection
import android.telecom.ConnectionRequest
import android.telecom.ConnectionService
import android.telecom.DisconnectCause
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager

const val EXTRA_CALL_ID = "com.voip.voip.EXTRA_CALL_ID"

/**
 * Android's entry point into our calling code. The OS calls
 * onCreateOutgoingConnection/onCreateIncomingConnection in response to
 * TelecomManager.placeCall()/addNewIncomingCall() (see VoipCallModule), and
 * this hands back a Connection Telecom then manages the system-level side
 * of (audio focus, other-call interruption, Bluetooth/car routing) — the
 * whole reason to go through Telecom instead of just playing audio directly.
 */
class VoipConnectionService : ConnectionService() {

    private val engineListener = object : CallEngine.Listener {
        override fun onCallStateChanged(call: CallEngine.ActiveCall) {
            val connection = VoipConnection.active[call.callId] ?: return
            when (call.state) {
                CallEngine.CallState.CONNECTING -> connection.setDialing()
                CallEngine.CallState.RINGING -> connection.setRinging()
                CallEngine.CallState.CONNECTED -> connection.setActive()
                CallEngine.CallState.ENDED -> {
                    connection.setDisconnected(DisconnectCause(DisconnectCause.LOCAL))
                    connection.destroy()
                    VoipConnection.active.remove(call.callId)
                }
                CallEngine.CallState.ERROR -> {
                    connection.setDisconnected(DisconnectCause(DisconnectCause.ERROR))
                    connection.destroy()
                    VoipConnection.active.remove(call.callId)
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        CallEngine.addListener(engineListener)
    }

    override fun onDestroy() {
        CallEngine.removeListener(engineListener)
        super.onDestroy()
    }

    override fun onCreateOutgoingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle,
        request: ConnectionRequest
    ): Connection {
        val callId = request.extras?.getString(EXTRA_CALL_ID) ?: ""
        val number = request.address?.schemeSpecificPart ?: ""

        val connection = VoipConnection(callId)
        connection.setNumber(number)
        connection.setDialing()
        VoipConnection.active[callId] = connection
        return connection
    }

    override fun onCreateIncomingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle,
        request: ConnectionRequest
    ): Connection {
        val callId = request.extras?.getString(EXTRA_CALL_ID) ?: ""
        val number = request.extras?.getString(TelecomManager.EXTRA_INCOMING_CALL_ADDRESS)
            ?: request.address?.schemeSpecificPart ?: ""

        val connection = VoipConnection(callId)
        connection.setNumber(number)
        connection.setRinging()
        VoipConnection.active[callId] = connection
        return connection
    }

    // Telecom can (and, per a real crash on-device, does) pass null here on
    // failure — unlike the success-path onCreateOutgoingConnection, where
    // it's always non-null. Declaring this non-null crashed the whole app
    // with a NullPointerException from Kotlin's own parameter check.
    override fun onCreateOutgoingConnectionFailed(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest
    ) {
        val callId = request.extras?.getString(EXTRA_CALL_ID) ?: return
        VoipConnection.active.remove(callId)
    }

    override fun onCreateIncomingConnectionFailed(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest
    ) {
        val callId = request.extras?.getString(EXTRA_CALL_ID) ?: return
        VoipConnection.active.remove(callId)
    }
}
