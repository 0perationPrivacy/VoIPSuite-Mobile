import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  useColorScheme,
  Appearance,
  NativeModules,
  AppState,
  Alert,
} from 'react-native';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {navigationRef} from './helpers/RootNavigation';

import styles from './style';
import {DrawerContent} from './components/DrawerComponent';
import StackComponent from './components/StackComponent';

import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import socketInstance from './helpers/socket';
import _ from 'lodash';
import {isLoggedIn} from './helpers/auth-header';
import {MESSAGE_CHANNEL_ID} from './helpers/config';
import {
  requestNotifications,
  check,
  PERMISSIONS,
  checkNotifications,
} from 'react-native-permissions';

const {Heartbeat} = NativeModules;

// import Heartbeat from './helpers/heartbeat';

// XMLHttpRequest = global.originalXMLHttpRequest ?
//   global.originalXMLHttpRequest :
//   global.XMLHttpRequest;

// // fetch logger
// global._fetch = fetch;
// global.fetch = function (uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then((response) => {
//     console.log('Fetch', { request: { uri, options, ...args }, response });
//     return response;
//   });
// };`

global.__reanimatedWorkletInit = () => {};

const App = () => {
  const Drawer = createDrawerNavigator();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // for app state change
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        Heartbeat.stopService();
        console.log(socketInstance.isConnected());
      }

      if (nextAppState == 'background') {
        if (isLoggedIn()) {
          Heartbeat.startService();
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      // ask for notification persmission
      // const settings = await Heartbeat.getNotificationSettings();
      // const permission = await requestNotifications([
      //   'alert',
      //   'badge',
      //   'sound',
      // ]);
      // console.log('permission', permission);
      // check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
      //   .then(result => {
      //     console.log('result', result);
      //     checkNotifications().then(({status, settings}) => {
      //       console.log('status, settings', status, settings);
      //     });
      //     requestNotifications(['alert', 'sound']).then(
      //       ({status, settings}) => {
      //         console.log('status, settings', status, settings);
      //       },
      //     );
      //   })
      //   .catch(error => {
      //     // …
      //   });

      // console.log(settings.authorizationStatus);
      // if (settings.authorizationStatus == 1) {
      //   // Alert.alert('Notification permissions has been authorized');
      //   console.log('Notification permissions has been authorized');
      // } else if (settings.authorizationStatus == 0) {
      //   // Alert.alert('You dont have permission');
      //   // await Heartbeat.openNotificationSettings();
      //   // console.log('done');

      //   const status = await Heartbeat.requestPermission();
      //   console.log(
      //     'notification permission status ====>',
      //     status?.authorizationStatus,
      //   );
      //   console.log('Notification permissions has been denied');
      // }

      const status = await Heartbeat.requestPermission();
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.flexOne}>
          {/* <StatusBar barStyle={isDarkMode ? 'dark-content' : 'dark-content'} /> */}
          <NavigationContainer ref={navigationRef}>
            <Drawer.Navigator
              screenOptions={{drawerStyle: styles.drawerStyle}}
              drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen
                name="Main"
                component={StackComponent}
                options={{headerShown: false}}
              />
            </Drawer.Navigator>
          </NavigationContainer>
          <FlashMessage position="bottom" />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
