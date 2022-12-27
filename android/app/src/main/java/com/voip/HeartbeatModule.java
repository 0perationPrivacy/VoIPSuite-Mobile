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

public class HeartbeatModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Heartbeat";
    private static ReactApplicationContext reactContext;

    public HeartbeatModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {
        this.reactContext.startService(new Intent(this.reactContext, HeartbeartService.class));
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, HeartbeartService.class));
    }

    @ReactMethod
    public void updateNotification(ReadableMap args, Promise promise) {
        if (args == null) {
            promise.reject("ERROR", "args cannot be null");
            return;
        }
        String channelId = args.getString("channelId");
        String notificationId = args.getString("notificationId");

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

        NotificationManagerCompat
                .from(getReactApplicationContext())
                .notify(
                        notificationId.hashCode(), // making it possible to cancel with "notifee" module
                        customNotification
                );
        promise.resolve(null);
    }

    public static PendingIntent getLaunchPendingIntent(Context context) {
        final PackageManager pm = context.getPackageManager();
        final Intent intent = pm.getLaunchIntentForPackage(context.getPackageName());

        int flag = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= 23) {
            flag = flag | PendingIntent.FLAG_IMMUTABLE;
        }

        return PendingIntent.getActivity(context, 0, intent, flag);
    }
}
