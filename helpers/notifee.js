import notifee, { EventType } from '@notifee/react-native';

export async function askForPermission() {
  let status = await notifee.requestPermission();
  return status.authorizationStatus === 1;
}

export function setupNotifeeHandlers() {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    console.log('type ====> notification')
    console.log(`notification.id ====> ${notification.id}`)

    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
      await notifee.cancelNotification(notification.id);
    }

    // await notifee.cancelNotification(notification.id);
  });
}