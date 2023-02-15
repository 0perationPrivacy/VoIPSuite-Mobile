package com.voip;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class NotificationHelper {

    public void presentLocalNotification(Bundle bundle, Context context) {

        String channelId = bundle.getString("channelId");
        String notificationId = bundle.getString("notificationId");

        Notification customNotification = new NotificationCompat.Builder(
                context, channelId)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setSortKey("-1")
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setSmallIcon(R.mipmap.ic_notification)
                .setColor(Color.rgb(251, 176, 59))
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setOnlyAlertOnce(true)
                .setContentIntent(getLaunchPendingIntent(context))
                //.addAction(R.drawable.ic_launcher, "Turn OFF driving mode", pendingIntent)
                .build();

        assert notificationId != null;
        NotificationManagerCompat
                .from(context)
                .notify(
                        notificationId.hashCode(),
                        customNotification);
    }

    private static PendingIntent getLaunchPendingIntent(Context context) {
        final PackageManager pm = context.getPackageManager();
        final Intent intent = pm.getLaunchIntentForPackage(context.getPackageName());

        int flag = PendingIntent.FLAG_UPDATE_CURRENT;
        flag = flag | PendingIntent.FLAG_IMMUTABLE;

        return PendingIntent.getActivity(context, 0, intent, flag);
    }

}
