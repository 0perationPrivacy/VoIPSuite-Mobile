import {NativeModules} from 'react-native';
import {MESSAGE_CHANNEL_ID, MESSAGE_CHANNEL_NAME} from './config';

const {Heartbeat} = NativeModules;

export function displayNotification({
  title,
  channelId,
  message = '',
  data = {},
}) {
  Heartbeat.displayNotification({
    title,
    message,
    channelId: channelId,
    data: JSON.stringify(data),
  });
}

export function createNotificationChannel(channelId, channelName) {
  Heartbeat.createNotificationChannel(channelId, channelName);
}

export async function socketMessageListener(data) {
  const {message, contact, number} = data;

  let title = number;
  if (contact) {
    const {first_name, last_name} = contact;
    title = first_name + ' ' + last_name;
  }

  createNotificationChannel(MESSAGE_CHANNEL_ID, MESSAGE_CHANNEL_NAME);
  displayNotification({
    title,
    message,
    channelId: MESSAGE_CHANNEL_ID,
    data: JSON.stringify(data),
  });
}
