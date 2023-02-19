package com.voip;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import java.security.SecureRandom;

import javax.annotation.Nonnull;


public class HeadlessNotificationModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public static final String REACT_CLASS = "Heartbeat";
    private static ReactApplicationContext reactContext;
    public static final String LOG_TAG = "VOIP_SUITE_NOTIFICATION_HANDLER";
    private final SecureRandom mRandomNumberGenerator = new SecureRandom();

    public HeadlessNotificationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        HeadlessNotificationModule.reactContext = reactContext;
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.v(LOG_TAG, "alert!!");
    }

    @Override
    public void onNewIntent(Intent intent) {
        Log.v(LOG_TAG, "alert!!");
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {
        reactContext.startService(new Intent(reactContext, HeadlessNotificationService.class));
    }

    @ReactMethod
    public void stopService() {
        reactContext.stopService(new Intent(reactContext, HeadlessNotificationService.class));
    }


    @ReactMethod
    public void displayNotification(ReadableMap args) {
        Bundle bundle = Arguments.toBundle(args);

        assert bundle != null;
        String notificationId = bundle.getString("notificationId");

        Log.v(LOG_TAG, String.valueOf(bundle));

        if (notificationId == null) {
            bundle.putString("notificationId", String.valueOf(mRandomNumberGenerator.nextInt()));
        }

        Context context = getReactApplicationContext();

        Intent notificationIntent = new Intent(context, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent,
                PendingIntent.FLAG_IMMUTABLE);

        NotificationHelper notificationHelper = new NotificationHelper();
        notificationHelper.presentLocalNotification(bundle, context);
    }


    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void createNotificationChannel(String channelId, String channelName) {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
            NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @ReactMethod
    public void checkPermissions(Promise promise) {
        NotificationManagerCompat managerCompat = NotificationManagerCompat.from(reactContext);
        promise.resolve(managerCompat.areNotificationsEnabled());
    }

    @RequiresApi(api = 33)
    @ReactMethod
    public void requestPermission(Promise promise) {
        // We have to handle this logic outside of our core module due to a react-native limitation
        // with obtaining the correct actvity
        PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
        if (activity == null) {
            activity.requestPermissions(
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    11111,
                    (PermissionListener) this);
        }
    }
}
