import notifee from '@notifee/react-native';

export async function askForPermission() {
  let status = await notifee.requestPermission();
  return status.authorizationStatus === 1;
}