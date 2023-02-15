package com.voip;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;

import static com.voip.HeadlessNotificationModule.LOG_TAG;

public class MainActivity extends ReactActivity {

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
        super.onCreate(null);
    }

    @Override
    public void onNewIntent(Intent intent) {
        Bundle bundle = intent.getExtras();
        if (bundle.getString("data") != null) {
            Log.v(LOG_TAG, "new intent for notification tap");

            NotificationJsDelivery notificationJsDelivery = new NotificationJsDelivery(getReactInstanceManager().getCurrentReactContext());
            notificationJsDelivery.notifyNotification(bundle);
        }

        super.onNewIntent(intent);
    }
}
