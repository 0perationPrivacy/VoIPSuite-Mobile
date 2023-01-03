/**
 * @format
 */

import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createChannel, displayNotification, setupNotifeeHandlers } from './helpers/notifee';
import socketClient from './helpers/socket';
import { MESSAGE_CHANNEL_ID, MESSAGE_CHANNEL_NAME } from './helpers/config';
import { getUserId, isLoggedIn } from './helpers/auth-header';

const MyHeadlessTask = async () => {
  let isConnected = socketClient.isConnected();
  var io = socketClient.socket;

  console.log('isConnected headless ===>', isConnected)

  if (!isConnected) {
    io = await socketClient.init();
  }

  const loginStatus = isLoggedIn();
  if (!loginStatus) return;

  const userId = getUserId();

  if (io) {
    socketClient.joinRoomByUserId(userId)
    socketClient.listenEventForMessage(async function (data) {
      const { message, contact, number } = data;
      let title = number;
      if (contact) {
        const { first_name, last_name } = contact;
        title = first_name + ' ' + last_name;
      }

      const channelId = await createChannel(MESSAGE_CHANNEL_ID, MESSAGE_CHANNEL_NAME)
      await displayNotification(title, channelId, message, { 'event_type': 'message', message: data })
    })
  }
};

setupNotifeeHandlers()

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);