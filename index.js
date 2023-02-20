/**
 * @format
 */

import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import socketClient from './helpers/socket';
import {getUserId, isLoggedIn} from './helpers/auth-header';
import {socketMessageListener} from './helpers/notification';

const MyHeadlessTask = async () => {
  const loginStatus = isLoggedIn();
  if (!loginStatus) return;

  console.log('socketClient.isConnected()', socketClient.isConnected());
  let isConnected = socketClient.isConnected();
  const userId = getUserId();

  if (!isConnected) socketClient.connect();

  // console.log(socketClient.hasListenerRegistered('user_message'));

  // if (socketClient.hasListenerRegistered('user_message')) return;

  // socketClient.joinRoomByUserId(userId);
  // socketClient.listenEventForMessage(socketMessageListener);
};

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
