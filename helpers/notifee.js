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

export async function createChannel(id, name) {
  const channelId = await notifee.createChannel({
    id: id,
    name: name,
  });

  return channelId;
}

export async function displayNotification(message, channelId, content = "", data = {}) {
  await notifee.displayNotification({
    title: message,
    body: content,
    data: data,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
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

  notifee.onForegroundEvent(async ({ type, detail }) => {
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
}