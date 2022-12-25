/**
 * @format
 */

import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setupNotifeeHandlers } from './helpers/notifee';
import notifee from '@notifee/react-native';
import socketClient from './helpers/socket';

const MyHeadlessTask = async () => {
  console.log('Receiving HeartBeat!');
  let isConnected = socketClient.isConnected();
  console.log('is connected =>', isConnected)

  if (isConnected) {
    console.log('about to fly')
    const io = socketClient.socket;

    io.on('connect_error', socket => {
      console.log(`socket connect error from headless ===> ${socket}`);
    });

    console.log('about to cry')

  } else {
    io = await socketClient.init();

    io.on("connect", () => {
      console.log('socket connected from headless');
    });

    io.emit("join_profile_channel", '621e9f2685a90200160c3160');
    io.on("user_message", async function (data) {
      console.log('data ===>', data)
      const { number, message } = data;
      const channelId = await notifee.createChannel({
        id: 'w-channel',
        name: 'Test w-channel',
      });

      await notifee.displayNotification({
        title: message,
        body: 'Main body content of the notification',
        data: { 'event_type': 'message', message: data },
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });

      // init()
    });

  }
};

setupNotifeeHandlers()

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
