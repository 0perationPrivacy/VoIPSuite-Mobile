import notifee, { EventType } from '@notifee/react-native';
import { store } from '../redux/store';
import { getCurrentActiveProfile } from './auth-header';
import { navigate } from './RootNavigation';
import _ from 'lodash'

export async function askForPermission() {
  let status = await notifee.requestPermission();
  return status.authorizationStatus === 1;
}

export async function cancel(notificationId) {
  await notifee.cancelNotification(notificationId);
}

export async function createChannel(params) {
  const channelId = await notifee.createChannel({
    id: 'my-channel',
    name: 'Test Channel',
  });

  return channelId;
}

export function setupNotifeeHandlers() {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    const { data } = notification;

    if (type === EventType.PRESS) {
      let profile = getCurrentActiveProfile();
      const { message = {} } = data;

      if ((profile && profile?._id) && (message && !_.isEmpty(message))) {
        delete Object.assign(message, { ['_id']: message['number'] })['number'];

        let params = { number: message, profile: { id: profile?._id } }
        console.log('params ===>', params)
        setTimeout(() => {
          navigate('Home', { data: params })
        }, 2000);
      }

      await notifee.cancelNotification(notification.id);
    }
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    const { notification, pressAction } = detail;
    console.log('pressActiddddon.id', pressAction, type)
    if (type === EventType.ACTION_PRESS) {
      console.log('type ====> notification')
      console.log(`notification.id ====> ${notification.id}`)
      console.log(`notification.data ====> ${notification.data?.event_type}`)
    }
  });
}