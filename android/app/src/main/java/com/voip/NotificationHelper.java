package com.voip;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import static android.content.Intent.FLAG_ACTIVITY_NEW_TASK;

import java.util.List;

public class NotificationHelper {
    public void presentLocalNotification(Bundle bundle, Context context) {

        String channelId = bundle.getString("channelId");
        String notificationId = bundle.getString("notificationId");
        String title = bundle.getString("title");
        String message = bundle.getString("message");
        String subText = bundle.getString("subText");

        NotificationCompat.Builder notification = new NotificationCompat.Builder(
                context, channelId)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setContentTitle(title)
                .setContentText(message)
                .setSortKey("-1")
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setSmallIcon(R.mipmap.ic_notification)
                .setColor(Color.rgb(251, 176, 59))
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setOnlyAlertOnce(true)
                .setAutoCancel(true)
                .setContentIntent(getLaunchPendingIntent(context, bundle));

        if (subText != null) {
            notification.setSubText(subText);
        }

        assert notificationId != null;
        NotificationManagerCompat
                .from(context)
                .notify(
                        notificationId.hashCode(),
                        notification.build());
    }

    private static PendingIntent getLaunchPendingIntent(Context context, Bundle bundle) {
        final PackageManager pm = context.getPackageManager();
        final Intent intent = pm.getLaunchIntentForPackage(context.getPackageName());

        int flag = PendingIntent.FLAG_UPDATE_CURRENT;
        flag = flag | PendingIntent.FLAG_IMMUTABLE;

        String data = bundle.getString("data");
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.putExtra("data", data);

        return PendingIntent.getActivity(context, 0, intent, flag);
    }

    static void promiseResolver(Promise promise, Exception e, Bundle bundle) {
        if (e != null) {
            // TODO custom error class with message/code
            promise.reject(e);
        } else if (bundle != null) {
            promise.resolve(Arguments.fromBundle(bundle));
        } else {
            promise.resolve(null);
        }
    }

    static void promiseResolver(Promise promise, Exception e, List<Bundle> bundleList) {
        if (e != null) {
            // TODO custom error class with message/code
            promise.reject(e);
        } else {
            WritableArray writableArray = Arguments.createArray();
            for (Bundle bundle : bundleList) {
                writableArray.pushMap(Arguments.fromBundle(bundle));
            }
            promise.resolve(writableArray);
        }
    }

    static void promiseResolver(Promise promise, Exception e) {
        if (e != null) {
            // TODO custom error class with message/code
            promise.reject(e);
        } else {
            promise.resolve(null);
        }
    }

    @Nullable
    private static MethodCallResult<Bundle> requestPermissionCallResult;

    public static void getNotificationSettings(MethodCallResult<Bundle> result, Context context) {
        boolean areNotificationsEnabled =
                NotificationManagerCompat.from(context)
                        .areNotificationsEnabled();

        Bundle notificationSettingsBundle = new Bundle();
        if (areNotificationsEnabled) {
            notificationSettingsBundle.putInt("authorizationStatus", 1);
        } else {
            notificationSettingsBundle.putInt("authorizationStatus", 0);
        }

        boolean canScheduleExactAlarms = canScheduleExactAlarms(context);
        Bundle androidSettingsBundle = new Bundle();

        if (canScheduleExactAlarms) {
            androidSettingsBundle.putInt("alarm", 1);
        } else {
            androidSettingsBundle.putInt("alarm", 0);
        }

        notificationSettingsBundle.putBundle("android", androidSettingsBundle);
        result.onComplete(null, notificationSettingsBundle);
    }

    public static void setRequestPermissionCallback(MethodCallResult<Bundle> result) {
        requestPermissionCallResult = result;
    }

    public static void openNotificationSettings(
            @Nullable String channelId, Activity activity, MethodCallResult<Void> result, Context context) {
        if (context == null || activity == null) {
            Log.d(
                    "openNotificationSettings",
                    "attempted to start activity but no current activity or context was available.");
            result.onComplete(null, null);
            return;
        }

        Intent intent;
        if (Build.VERSION.SDK_INT >= 26) {
            if (channelId != null) {
                intent = new Intent(Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS);
                intent.putExtra(Settings.EXTRA_CHANNEL_ID, channelId);
            } else {
                intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            }
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, context.getPackageName());
        } else {
            intent = new Intent(Settings.ACTION_APPLICATION_SETTINGS);
        }

        intent.setFlags(FLAG_ACTIVITY_NEW_TASK);

        activity.runOnUiThread(() -> context.startActivity(intent));
        result.onComplete(null, null);
    }


    public static boolean canScheduleExactAlarms(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return getAlarmManager(context).canScheduleExactAlarms();
        }
        return true;
    }

    public static AlarmManager getAlarmManager(Context context) {
        return (AlarmManager) context.getApplicationContext().getSystemService(Context.ALARM_SERVICE);
    }

}
