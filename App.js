import React, { useEffect } from 'react';
import {
  SafeAreaView,
  useColorScheme,
  Appearance,
  NativeModules,
  Text,
  View,
  Alert
} from 'react-native';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import { navigationRef } from './helpers/RootNavigation';

import styles from './style';
import { DrawerContent } from './components/DrawerComponent';
import StackComponent from './components/StackComponent';

import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from "react-native-flash-message";
import socketClient from './helpers/socket';
import { askForPermission } from './helpers/notifee';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from './components';
const { Heartbeat } = NativeModules;

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

global.__reanimatedWorkletInit = () => { };

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const colorScheme = Appearance.getColorScheme();
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    // const io = await getSocketInstance();

    // io.emit("join_profile_channel", 'jjj');

    // io.emit("join_profile_channel", 'channe test id from voip app');

    // io.on('join_profile_channel', (channel) => {
    //   console.log(`${channel} join_profile_channel`);
    //   // io.join(channel);
    // });

    // // io.on('connect', socket => {
    // //   console.log(`socket on connectionsss ===> ${socket}`);


    // // });

    // io.on('connect_error', socket => {
    //   console.log(`socket connect error ===> ${socket}`);
    // });

  }, [])

  useEffect(() => {
    (async () => {
      io = await socketClient.init();

      io.on("connect", () => {
        console.log('socket connected');
      });

      io.on('connect_error', socket => {
        console.log(`socket connect error ===> ${socket}`);
      });

      // ask for notification persmission
      await askForPermission()
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return (
    // <Provider store={store}>
    //   <PersistGate loading={null} persistor={persistor}>
    //     <SafeAreaView style={styles.flexOne}>
    //       {/* <StatusBar barStyle={isDarkMode ? 'dark-content' : 'dark-content'} /> */}
    //       <NavigationContainer ref={navigationRef} >
    //         <Drawer.Navigator screenOptions={{ drawerStyle: styles.drawerStyle }} drawerContent={(props) => <DrawerContent {...props} />} >
    //           <Drawer.Screen name="Main" component={StackComponent} options={{ headerShown: false }} />
    //         </Drawer.Navigator>
    //       </NavigationContainer>
    //       <FlashMessage position="bottom" />
    //     </SafeAreaView>
    //   </PersistGate>
    // </Provider>

    <View>
      <Button onPress={() => Heartbeat.startService()} title={'Start'} />
      <Button onPress={() => Heartbeat.stopService()} title={'Stop'} buttonStyle={{marginTop : 50}} />
  
    </View>
  );
};


export default App;
