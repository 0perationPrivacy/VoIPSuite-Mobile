/**
 * @format
 */

import 'react-native-gesture-handler';

import {AppRegistry, NativeModules} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import socketClient from './helpers/socket';
import {MESSAGE_CHANNEL_ID, MESSAGE_CHANNEL_NAME} from './helpers/config';
import {getUserId, isLoggedIn} from './helpers/auth-header';

const MyHeadlessTask = async () => {
  const loginStatus = isLoggedIn();
  if (!loginStatus) return;

  console.log('socketClient.isConnected()', socketClient.isConnected());
  let isConnected = socketClient.isConnected();
  const userId = getUserId();

  if (!isConnected) socketClient.connect();

  socketClient.joinRoomByUserId(userId);
  socketClient.listenEventForMessage(async function (data) {
    const {message, contact, number} = data;

    let title = number;
    if (contact) {
      const {first_name, last_name} = contact;
      title = first_name + ' ' + last_name;
    }

    const {Heartbeat} = NativeModules;

    Heartbeat.createNotificationChannel(
      MESSAGE_CHANNEL_ID,
      MESSAGE_CHANNEL_NAME,
    );

    Heartbeat.displayNotification({
      title,
      message,
      channelId: MESSAGE_CHANNEL_ID,
      data: JSON.stringify(data),
    });
  });
};

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
