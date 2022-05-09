import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { showMessage, hideMessage } from "react-native-flash-message";

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeHeader from './HomeHeader';

import Login from '../screens/Login/Login';
import SignUp from '../screens/SignUp/signUp';
import Home from '../screens/Home/home';
import Compose from '../screens/Compose/compose';
import Contact from '../screens/Contacts/contact';
import Messages from '../screens/Messages/message';
import DialPad from '../screens/dialpad/dialpad';
import ProfileSettings from '../screens/ProfileSettings/profilesettings';
import Splash from '../screens/Splash';
import EmailSettings from '../screens/EmailSettings/email';
import Accounts from '../screens/Accounts';
import ChangeUsername from '../screens/Accounts/username';

import _ from 'lodash';

const StackComponent = () => {
	const Stack = createNativeStackNavigator();
	const headerOption = { headerShown: false };

	const alert = useSelector(state => state.alert);

	useEffect(() => {
		const { message, type } = alert;
		if (!_.isEmpty(message)) {
			showMessage({
				message: message,
				type: type,
			});
		}

	}, [alert])

	return (
		<Stack.Navigator initialRouteName="Splash">
			<Stack.Screen name="Splash" component={Splash} options={headerOption} />
			<Stack.Screen name="Login" component={Login} options={headerOption} />
			<Stack.Screen name="Signup" component={SignUp} options={headerOption} />
			<Stack.Screen name="Home" component={Home} options={headerOption} />
			<Stack.Screen name="Compose" component={Compose} options={headerOption} />
			<Stack.Screen name="Contact" component={Contact} options={headerOption} />
			<Stack.Screen name="Messages" component={Messages} options={{ header: HomeHeader }} />
			<Stack.Screen name="Dialer" component={DialPad} options={headerOption} />
			<Stack.Screen name="ProfileSettings" component={ProfileSettings} options={headerOption} />
			<Stack.Screen name="emailsettings" component={EmailSettings} options={headerOption} />
			<Stack.Screen name="accounts" component={Accounts} options={headerOption} />
			<Stack.Screen name="changeusername" component={ChangeUsername} options={headerOption} />
		</Stack.Navigator>
	);
};

export default StackComponent;
