import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './helpers/RootNavigation';

import Login from './screens/Login/Login';
import SignUp from './screens/SignUp/SignUp';

import styles from './style';
import Home from './screens/Home/home';
import HomeHeader from './components/HomeHeader';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Stack = createNativeStackNavigator();

  const headerOption = { headerShown: false };

  return (
    <SafeAreaView style={styles.flexOne}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          {/* <Stack.Screen name="Login" component={Login} options={headerOption} />
          <Stack.Screen name="Signup" component={SignUp} options={headerOption} /> */}
          <Stack.Screen name="Home" component={Home} options={{ header : HomeHeader }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
