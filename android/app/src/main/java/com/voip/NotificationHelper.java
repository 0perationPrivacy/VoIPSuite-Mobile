package com.voip;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

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
                .setContentIntent(getLaunchPendingIntent(context,bundle));

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

    private static PendingIntent getLaunchPendingIntent(Context context,Bundle bundle) {
        final PackageManager pm = context.getPackageManager();
        final Intent intent = pm.getLaunchIntentForPackage(context.getPackageName());

        int flag = PendingIntent.FLAG_UPDATE_CURRENT;
        flag = flag | PendingIntent.FLAG_IMMUTABLE;

        String data = bundle.getString("data");
        intent.putExtra("data", data);

        return PendingIntent.getActivity(context, 0, intent, flag);
    }
}
