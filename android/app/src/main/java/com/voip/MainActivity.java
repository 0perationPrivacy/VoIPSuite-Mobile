package com.voip;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactApplicationContext;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import static com.voip.HeadlessNotificationModule.LOG_TAG;

public class MainActivity extends ReactActivity {
    private static ReactApplicationContext reactContext;

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Voip";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        if (savedInstanceState == null) {

        }
        super.onCreate(null);
    }

    public void onNewIntent(Intent intent) {
//        Bundle bundle = intent.getBundleExtra("dsda");
//        bundle.putString("test", "data");

//        NotificationJsDelivery notificationJsDelivery = new NotificationJsDelivery(reactContext);
//        notificationJsDelivery.notifyNotification();

        Log.d(LOG_TAG, "sss");
        Log.d(LOG_TAG, String.valueOf(reactContext));
    }
}
