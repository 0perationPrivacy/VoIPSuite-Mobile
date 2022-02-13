// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'
import { View, StatusBar } from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { AuthWrapper } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';

const Login = ({ navigation }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const onPressSignUp = () => {
		navigation.navigate('Signup');
	}

	return (
		<AuthWrapper>
			<StatusBar style="light" />
			<Image source={logo} style={styles.ImageDimension} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Enter Username"
					autoFocus
					type="text"
					value={username}
					onChangeText={(text) => setUsername(text)}
				/>
				<Input
					placeholder="Enter Password"
					secureTextEntry
					type="password"
					value={password}
					onChangeText={(text) => setPassword(text)}
				// onSubmitEditing={signIn}
				/>
			</View>

			<Button containerStyle={styles.button} title="Login" />
			<Button containerStyle={styles.button} title="Create Account" type="outline" onPress={onPressSignUp} />
		</AuthWrapper>
	)
}

export default Login;