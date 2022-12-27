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
  console.log('isConnected ===>', isConnected)

  if (isConnected) {
    const io = socketClient.socket;

    io.on('connect_error', socket => {
      console.log(`socket connect error from headless ===> ${socket}`);
    });

  } else {
    io = await socketClient.init();
    let loginStatus = isLoggedIn();
    let userId = getUserId();

    console.log('userId ====>', userId);

    if (io && loginStatus) {
      socketClient.joinRoomByUserId(userId)
      socketClient.listenEventForMessage(async function (data) {
        console.log('data about ===>', data)
        const { message } = data;

        const channelId = await createChannel(MESSAGE_CHANNEL_ID, MESSAGE_CHANNEL_NAME)
        await displayNotification(message, channelId, 'Main body content of the notification', { 'event_type': 'message', message: data })
      })
    }
  }
};

setupNotifeeHandlers()

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);