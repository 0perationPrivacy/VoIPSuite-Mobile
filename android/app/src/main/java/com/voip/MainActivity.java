package com.voip;

import android.content.Intent;
import android.os.Bundle;
import android.os.Looper;
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
        Log.v(LOG_TAG, String.valueOf(getIntent().hasExtra("fromNotification")));
        super.onCreate(savedInstanceState);

        new android.os.Handler(Looper.getMainLooper()).postDelayed(
                () -> {
                    Log.i("tag", "This'll run 300 milliseconds later");
                    Log.v("This'll run 300 millise", String.valueOf(getIntent().hasExtra("fromNotification")));
                    if (getIntent().hasExtra("fromNotification")) {
                        while (getReactInstanceManager().getCurrentReactContext() == null) ;

                        Log.v(LOG_TAG, "new intent for notification tap from killed state");

                        NotificationJsDelivery notificationJsDelivery = new NotificationJsDelivery(getReactInstanceManager().getCurrentReactContext());
                        notificationJsDelivery.notifyNotification(getIntent().getExtras());
                    }
                },
                2000);

    }

    @Override
    public void onNewIntent(Intent intent) {
        Bundle bundle = intent.getExtras();
        if (bundle != null) {
            Log.v(LOG_TAG, "new intent for notification tap");

            NotificationJsDelivery notificationJsDelivery = new NotificationJsDelivery(getReactInstanceManager().getCurrentReactContext());
            notificationJsDelivery.notifyNotification(bundle);
        }

        super.onNewIntent(intent);
    }
}
