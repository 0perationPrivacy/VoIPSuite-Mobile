import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
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

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const Drawer = createDrawerNavigator();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.flexOne}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer ref={navigationRef}>
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} >
              <Drawer.Screen name="Main" component={StackComponent} options={{ headerShown: false }} />
            </Drawer.Navigator>
          </NavigationContainer>
          <FlashMessage position="top" />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
