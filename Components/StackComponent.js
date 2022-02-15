import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeHeader from './HomeHeader';

import Login from '../screens/Login/Login';
import SignUp from '../screens/SignUp/SignUp';
import Home from '../screens/Home/home';

const StackComponent = () => {
	const Stack = createNativeStackNavigator();
	const headerOption = { headerShown: false };

	return (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen name="Login" component={Login} options={headerOption} />
			<Stack.Screen name="Signup" component={SignUp} options={headerOption} />
			<Stack.Screen name="Home" component={Home} options={{ header: HomeHeader }} />
		</Stack.Navigator>
	);
};

export default StackComponent;
