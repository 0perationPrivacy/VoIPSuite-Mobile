package com.voip;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.ReactApplicationContext;

public class HeadlessNotificationService extends Service {

    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "VoIP Messaging";

    private Handler handler = new Handler();
    private final Runnable runnableCode = new Runnable() {

        @Override
        public void run() {
            Context context = getApplicationContext();
            Intent myIntent = new Intent(context, NotificationEventService.class);
            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            handler.postDelayed(this, 10000);
        }
    };

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_LOW;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "VoIP Messaging", importance);
            channel.setDescription("CHANNEL DESCRIPTION");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        this.handler.post(this.runnableCode);
        createNotificationChannel();

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent,
                PendingIntent.FLAG_IMMUTABLE);

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("VoIP Suite")
                .setContentText("View messages.")
                .setSmallIcon(R.mipmap.ic_notification)
                .setColor(Color.rgb(251, 176, 59))
                .setContentIntent(contentIntent)
                .setOngoing(false)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .setVisibility(NotificationCompat.VISIBILITY_SECRET)
                .build();

        startForeground(SERVICE_NOTIFICATION_ID, notification);

        return START_NOT_STICKY;
    }

}
