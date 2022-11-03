package com.voip;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Callback;
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

    @ReactMethod
    public void displayNotification() {
        Intent intent = new Intent();

//        intent.setAction(Intent.ACTION_SEND);
        intent.putExtra(Intent.EXTRA_TEXT, "textMessage");
        intent.setType("text/plain");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

        intent.setAction(Long.toString(847878454));
        PendingIntent pendingIntent = PendingIntent.getActivity(NotificationModule.reactContext, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT);

        String CHANNEL_ID = "notificationsChannel";

        NotificationCompat.Builder builder = new NotificationCompat.Builder(NotificationModule.reactContext,
                CHANNEL_ID);
        builder.setSmallIcon(17301575);
        builder.setContentTitle("Notifiks");
        builder.setContentText("Narmal teksts");
        builder.setPriority(NotificationCompat.PRIORITY_DEFAULT);
        builder.setContentIntent(pendingIntent);
        builder.setAutoCancel(false);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(NotificationModule.reactContext);
        notificationManager.notify(123, builder.build());
    }

    @ReactMethod
    public void createNotificationChannel() {
        String CHANNEL_ID = "notificationsChannel";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = new StringBuffer("charsequence");
            String description = "kkads apraksts";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }

}