import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Appearance
} from 'react-native';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import { navigationRef } from './helpers/RootNavigation';

import styles from './style';
import { DrawerContent } from './components/DrawerComponent';
import StackComponent from './components/StackComponent';

import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from "react-native-flash-message";

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
// };

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const colorScheme = Appearance.getColorScheme();
  const Drawer = createDrawerNavigator();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.flexOne}>
          {/* <StatusBar barStyle={isDarkMode ? 'dark-content' : 'dark-content'} /> */}
          <NavigationContainer ref={navigationRef} >
            <Drawer.Navigator screenOptions={{ drawerStyle: styles.drawerStyle }} drawerContent={(props) => <DrawerContent {...props} />} >
              <Drawer.Screen name="Main" component={StackComponent} options={{ headerShown: false }} />
            </Drawer.Navigator>
          </NavigationContainer>
          <FlashMessage position="bottom" />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};


export default App;
