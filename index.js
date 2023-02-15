/**
 * @format
 */

import 'react-native-gesture-handler';

import {AppRegistry, NativeModules} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  createChannel,
  displayNotification,
  getChannelById,
  setupNotifeeHandlers,
} from './helpers/notifee';
import socketClient from './helpers/socket';
import {MESSAGE_CHANNEL_ID, MESSAGE_CHANNEL_NAME} from './helpers/config';
import {getUserId, isLoggedIn} from './helpers/auth-header';

const MyHeadlessTask = async () => {
  // socketClient.disconnect();
  let isConnected = socketClient.isConnected();
  var io = socketClient.socket;
  console.log('isConnected headless ===>', isConnected);

  const loginStatus = isLoggedIn();
  if (!loginStatus) return;

  const userId = getUserId();

  if (!isConnected) {
    io = await socketClient.init();

    console.log(socketClient.isConnected());

    socketClient.joinRoomByUserId(userId);
    socketClient.listenEventForMessage(async function (data) {
      console.log('data');
      const {message, contact, number} = data;
      console.log('message, contact, number', message, contact, number);
      let title = number;
      if (contact) {
        const {first_name, last_name} = contact;
        title = first_name + ' ' + last_name;
      }

      // const channelId = await createChannel(
      //   MESSAGE_CHANNEL_ID,
      //   MESSAGE_CHANNEL_NAME,
      // );
      // await displayNotification(title, channelId, message, {
      //   event_type: 'message',
      //   message: data,
      // });

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
  }
};

setupNotifeeHandlers();

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
