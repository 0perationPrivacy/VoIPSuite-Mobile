package com.voip;

import android.annotation.SuppressLint;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class NotificationModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    NotificationModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void getPhoneID(Promise response) {
        try {
            @SuppressLint("HardwareIds")
            String id = Settings.Secure.getString(reactContext.getContentResolver(), Settings.Secure.ANDROID_ID);
            response.resolve(id);
        } catch (Exception e) {
            response.reject("Error", e);
        }
    }

    @ReactMethod
    public void testFunction(Promise response) {
        Log.d("MyApp", "I am here");
    }

    @ReactMethod
    public void sendNotification() {
        Log.d("MyApp", "In notification");
        NotificationCompat.Builder nBuilder;
        Uri alarmSound = RingtoneManager
                .getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        Context context = null;
        nBuilder = new NotificationCompat.Builder(context, "voip-notification")
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentTitle("Kluebook - ")
                .setLights(Color.BLUE, 500, 500).setContentText("message")
                .setAutoCancel(true).setTicker("Notification from kluebook")
                .setVibrate(new long[] { 100, 250, 100, 250, 100, 250 })
                .setSound(alarmSound);

        Intent resultIntent = null;
        resultIntent = new Intent(context, MainApplication.class);

        PendingIntent resultPendingIntent = PendingIntent.getActivity(context,
                2, resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);
         nBuilder.setContentIntent(resultPendingIntent);
        NotificationManager nNotifyMgr = (NotificationManager) context
                .getSystemService(context.NOTIFICATION_SERVICE);
        nNotifyMgr.notify(2, nBuilder.build());
    }
}