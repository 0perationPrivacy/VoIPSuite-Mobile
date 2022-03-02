import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeHeader from './HomeHeader';

import Login from '../screens/Login/Login';
import SignUp from '../screens/SignUp/SignUp';
import Home from '../screens/Home/home';
import Compose from '../screens/Compose/compose';
import Contact from '../screens/Contacts/contact';
import Messages from '../screens/Messages/message';
import DialPad from '../screens/dialpad/dialpad';

const StackComponent = () => {
	const Stack = createNativeStackNavigator();
	const headerOption = { headerShown: false };

	return (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen name="Login" component={Login} options={headerOption} />
			<Stack.Screen name="Signup" component={SignUp} options={headerOption} />
			<Stack.Screen name="Home" component={Home} options={{ header: HomeHeader }} />
			<Stack.Screen name="Compose" component={Compose} options={headerOption} />
			<Stack.Screen name="Contact" component={Contact} options={headerOption} />
			<Stack.Screen name="Messages" component={Messages} options={headerOption} />
			<Stack.Screen name="Dialer" component={DialPad} options={headerOption} />
		</Stack.Navigator>
	);
};

export default StackComponent;
