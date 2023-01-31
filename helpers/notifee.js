import notifee, {AndroidColor, AndroidImportance, EventType} from '@notifee/react-native';
import {store} from '../redux/store';
import {getCurrentActiveProfile} from './auth-header';
import {navigate} from './RootNavigation';
import _ from 'lodash';

export async function askForPermission() {
  let status = await notifee.requestPermission();
  return status.authorizationStatus === 1;
}

export async function cancel(notificationId) {
  await notifee.cancelNotification(notificationId);
}

export async function getChannelById(id) {
  const channel = await notifee.getChannel(id);
  return channel.id;
}

export async function createChannel(id, name) {
  const channelId = await notifee.createChannel({
    id: id,
    name: name,
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });

  return channelId;
}

export async function displayNotification(
  message,
  channelId,
  content = '',
  data = {},
) {
  return await notifee.displayNotification({
    title: message,
    body: content,
    data: data,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_notification',
      color: '#f9b03c',
      pressAction: {
        id: 'default',
      },
    },
  });
}

const onNotificationTap = async ({type, detail}) => {
  const {notification, pressAction} = detail;
  const {data} = notification;

  if (type === EventType.PRESS) {
    let profile = getCurrentActiveProfile();
    const {message = {}} = data;

    if (profile && profile?._id && message && !_.isEmpty(message)) {
      delete Object.assign(message, {['_id']: message['number']})['number'];

      let params = {number: message, profile: {id: profile?._id}};
      setTimeout(() => {
        navigate('Home', {data: params});
      }, 2000);
    }

    await notifee.cancelNotification(notification.id);
  }
};

export function setupNotifeeHandlers() {
  notifee.onBackgroundEvent(onNotificationTap);
  notifee.onForegroundEvent(onNotificationTap);
}
