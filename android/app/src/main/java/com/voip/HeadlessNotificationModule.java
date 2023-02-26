package com.voip;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
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
import java.util.logging.Logger;

import javax.annotation.Nonnull;


public class HeadlessNotificationModule extends ReactContextBaseJavaModule implements PermissionListener {

    public static final String REACT_CLASS = "Heartbeat";
    private static ReactApplicationContext reactContext;
    public static final String LOG_TAG = "VOIP_SUITE_NOTIFICATION_HANDLER";
    private final SecureRandom mRandomNumberGenerator = new SecureRandom();

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
    public void getNotificationSettings(Promise promise) {
        NotificationHelper
                .getNotificationSettings(
                        (e, aBundle) -> NotificationHelper.promiseResolver(promise, e, aBundle), reactContext);
    }

    @ReactMethod
    public void checkPermissions(Promise promise) {
        NotificationManagerCompat managerCompat = NotificationManagerCompat.from(reactContext);
        promise.resolve(managerCompat.areNotificationsEnabled());
    }

    @ReactMethod
    public void requestPermission(Promise promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            NotificationHelper
                    .getNotificationSettings(
                            (e, aBundle) -> NotificationHelper.promiseResolver(promise, e, aBundle), reactContext);
            return;
        }

        PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
        if (activity == null) {
            Log.d(
                    "requestPermission",
                    "Unable to get permissionAwareActivity for " + Build.VERSION.SDK_INT);

            NotificationHelper
                    .getNotificationSettings(
                            (e, aBundle) -> NotificationHelper.promiseResolver(promise, e, aBundle), reactContext);
            return;
        }

        NotificationHelper
                .setRequestPermissionCallback(
                        (e, aBundle) -> NotificationHelper.promiseResolver(promise, e, aBundle));

        activity.requestPermissions(
                new String[]{Manifest.permission.POST_NOTIFICATIONS},
                11111,
                (PermissionListener) this);
    }

    @ReactMethod
    public void openNotificationSettings(Promise promise) {
        String packageName = reactContext.getPackageName();
        Intent intent = new Intent();

        if (Build.VERSION.SDK_INT >= 26) {
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("android.provider.extra.APP_PACKAGE", packageName);
            intent.putExtra("app_package", packageName);
            intent.putExtra("app_uid", reactContext.getApplicationInfo().uid);
        } else {
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.addCategory(Intent.CATEGORY_DEFAULT);
            intent.setData(Uri.parse("package:" + packageName));
        }

        getReactApplicationContext().startActivityForResult(intent, 1, null);

        Bundle notificationSettingsBundle = new Bundle();
        notificationSettingsBundle.putInt("authorizationStatus", 1);
        promise.resolve(Arguments.fromBundle(notificationSettingsBundle));
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        return false;
    }
}
