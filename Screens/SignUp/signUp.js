import React, { useState } from 'react'
import { View, KeyboardAvoidingView, StatusBar } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
import styles from '../authCss';
const logo = require('../../assets/logo-b.svg')

const SignUp = (props) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [serverUrl, setServerUrl] = useState('')

	const onPressLogin = () => {
		navigate('Login')
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
				<Input
					placeholder="Confirm Password"
					secureTextEntry
					type="password"
					value={confirmPassword}
					onChangeText={(text) => setConfirmPassword(text)}
				// onSubmitEditing={signIn}
				/>
				<Input
					placeholder="Enter Server Url (Optional)"
					type="text"
					value={serverUrl}
					onChangeText={(text) => setServerUrl(text)}
				/>
			</View>

			<Button containerStyle={styles.button} title="Sign Up" />
			<Button containerStyle={styles.button} title="Login" type="outline" onPress={onPressLogin} />
		</AuthWrapper>

	)
}

export default SignUp;