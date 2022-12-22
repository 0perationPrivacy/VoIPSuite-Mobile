/**
 * @format
 */

import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setupNotifeeHandlers } from './helpers/notifee';
import notifee from '@notifee/react-native';

const MyHeadlessTask = async () => {
  console.log('Receiving HeartBeat!');
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Test Channel',
  });

  await notifee.displayNotification({
    title: 'Welcome to VoIP Suite from headless',
    body: 'Main body content of the notification',
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });

};

// await BackgroundService.start(MyHeadlessTask,  {
//   taskName: 'Example',
//   taskTitle: 'ExampleTask title',
//   taskDesc: 'ExampleTask description',
//   taskIcon: {
//       name: 'ic_launcher',
//       type: 'mipmap',
//   },
//   color: '#ff00ff',
//   linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
//   parameters: {
//       delay: 1000,
//   },
// });
// await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' }); // Only Android, iOS will ignore this call


// setupNotifeeHandlers()

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
