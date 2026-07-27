package com.voip.voip

import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.voip.MainActivity

/**
 * Shown full-screen over the lock screen for an incoming call — the one part
 * of the calling UI that has to work natively rather than through RN, since it
 * must appear reliably even if the JS context is cold or the app was killed
 * and only just woken by the incoming call. A plain programmatic layout
 * (no XML resource) keeps it self-contained; the polished call UI is the RN
 * in-call screen this hands off to once answered.
 */
class IncomingCallActivity : AppCompatActivity() {

    private val engineListener = object : CallEngine.Listener {
        override fun onCallStateChanged(call: CallEngine.ActiveCall) {
            if (call.state == CallEngine.CallState.ENDED || call.state == CallEngine.CallState.ERROR) {
                finish()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setShowOverLockScreen()

        val number = CallEngine.currentCall?.number ?: intent.getStringExtra(EXTRA_NUMBER) ?: "Unknown"
        setContentView(buildLayout(number))

        CallEngine.addListener(engineListener)
    }

    override fun onDestroy() {
        CallEngine.removeListener(engineListener)
        super.onDestroy()
    }

    private fun setShowOverLockScreen() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            )
        }
    }

    private fun buildLayout(number: String): LinearLayout {
        val accent = Color.rgb(251, 176, 59)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.rgb(11, 11, 13))
            setPadding(64, 64, 64, 64)
        }

        root.addView(TextView(this).apply {
            text = "Incoming call"
            setTextColor(Color.WHITE)
            textSize = 16f
            gravity = Gravity.CENTER
        })

        root.addView(TextView(this).apply {
            text = number
            setTextColor(Color.WHITE)
            textSize = 32f
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 96)
        })

        val buttonRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }

        buttonRow.addView(Button(this).apply {
            text = "Decline"
            setBackgroundColor(Color.rgb(229, 72, 77))
            setTextColor(Color.WHITE)
            setPadding(48, 24, 48, 24)
            setOnClickListener {
                CallEngine.rejectCall()
                finish()
            }
        }, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply { marginEnd = 24 })

        buttonRow.addView(Button(this).apply {
            text = "Accept"
            setBackgroundColor(accent)
            setTextColor(Color.BLACK)
            setPadding(48, 24, 48, 24)
            setOnClickListener {
                CallEngine.answerCall()
                startActivity(Intent(this@IncomingCallActivity, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                })
                finish()
            }
        }, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

        root.addView(buttonRow)
        return root
    }

    companion object {
        const val EXTRA_NUMBER = "com.voip.voip.EXTRA_NUMBER"
    }
}
