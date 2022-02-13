import React, { useState } from 'react'
import { View, KeyboardAvoidingView, StatusBar } from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { AuthWrapper } from '../../components';
import styles from '../authCss';
const logo = require('../../assets/logo-b.svg')

const SignUp = (props) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

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

			<Button containerStyle={styles.button} title="Sign Up" />
			<Button containerStyle={styles.button} title="Login" type="outline" />
			<View style={{ height: 100 }} />
		</AuthWrapper>

	)
}

export default SignUp;