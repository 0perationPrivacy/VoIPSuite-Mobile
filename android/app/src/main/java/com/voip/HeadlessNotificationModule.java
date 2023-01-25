package com.voip;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import javax.annotation.Nonnull;

public class HeadlessNotificationModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Heartbeat";
    private static ReactApplicationContext reactContext;

    public HeadlessNotificationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        HeadlessNotificationModule.reactContext = reactContext;
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
    public void updateNotification(ReadableMap args, Promise promise) {
        if (args == null) {
            promise.reject("ERROR", "args cannot be null");
            return;
        }
        String channelId = args.getString("channelId");
        String notificationId = args.getString("notificationId");

        assert channelId != null;
        Notification customNotification = new NotificationCompat.Builder(
                getReactApplicationContext(), channelId) // channel is created with another module in js
                .setPriority(NotificationCompat.PRIORITY_MAX) // For N and below
                .setSortKey("-1")
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setSmallIcon(R.drawable.ic_launcher)
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setOnlyAlertOnce(true)
                .setOngoing(true)
                .setAutoCancel(false)
                .setShowWhen(false)
                .setContentIntent(getLaunchPendingIntent(getReactApplicationContext()))
                .build();

        assert notificationId != null;
        NotificationManagerCompat
                .from(getReactApplicationContext())
                .notify(
                        notificationId.hashCode(), // making it possible to cancel with "notifee" module
                        customNotification);
        promise.resolve(null);
    }

    public static PendingIntent getLaunchPendingIntent(Context context) {
        final PackageManager pm = context.getPackageManager();
        final Intent intent = pm.getLaunchIntentForPackage(context.getPackageName());

        int flag = PendingIntent.FLAG_UPDATE_CURRENT;
        flag = flag | PendingIntent.FLAG_IMMUTABLE;

        return PendingIntent.getActivity(context, 0, intent, flag);
    }
}
