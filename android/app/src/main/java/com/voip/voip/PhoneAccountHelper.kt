package com.voip.voip

import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.telecom.PhoneAccount
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager
import kotlin.jvm.JvmStatic

/**
 * Registers this app as a self-managed Telecom calling app — the same
 * mechanism Signal and Linphone's own app use for a native-feeling in-call UI
 * (full-screen incoming call, lock-screen controls, Bluetooth/car integration)
 * without needing SIM/carrier telephony permissions. Called once from
 * MainApplication.onCreate().
 */
object PhoneAccountHelper {
    const val ACCOUNT_ID = "com.voip.voip.SIP_ACCOUNT"

    @JvmStatic
    fun getHandle(context: Context): PhoneAccountHandle {
        return PhoneAccountHandle(ComponentName(context, VoipConnectionService::class.java), ACCOUNT_ID)
    }

    @JvmStatic
    fun register(context: Context) {
        val telecomManager = context.getSystemService(Context.TELECOM_SERVICE) as? TelecomManager ?: return
        val handle = getHandle(context)

        val builder = PhoneAccount.builder(handle, "VoIP Suite")
            .setCapabilities(PhoneAccount.CAPABILITY_SELF_MANAGED)
            .setShortDescription("VoIP Suite calling")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
            builder.setIcon(android.graphics.drawable.Icon.createWithResource(context, context.applicationInfo.icon))
        }

        telecomManager.registerPhoneAccount(builder.build())
    }

    @JvmStatic
    fun isRegistered(context: Context): Boolean {
        val telecomManager = context.getSystemService(Context.TELECOM_SERVICE) as? TelecomManager ?: return false
        return try {
            telecomManager.getPhoneAccount(getHandle(context)) != null
        } catch (e: SecurityException) {
            false
        }
    }
}
