import React, { useState } from 'react'
import { View } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import { useForm } from 'react-hook-form'

const Login = (props) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [serverUrl, setServerUrl] = useState('')
    const { control, handleSubmit } = useForm();

	const onPressSignUp = () => {
		navigate('Signup');
	}

	const onPressSignIn = () => {
		navigate('Home');
	}

	return (
		<AuthWrapper>
			<Image source={logo} style={styles.ImageDimension} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Enter Username"
					autoFocus
					type="text"
					value={username}
					onChangeText={(text) => setUsername(text)}
					style={styles.inputWrap}
					control={control}
				/>
				<Input
					placeholder="Enter Password"
					secureTextEntry
					type="password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					control={control}
				/>
				<Input
					placeholder="Enter Server Url (Optional)"
					type="text"
					value={serverUrl}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
				/>
			</View>
			<Button containerStyle={styles.button} title="Login" onPress={onPressSignIn} />
			<Button containerStyle={styles.button} title="Create Account" type="outline" onPress={onPressSignUp} />
		</AuthWrapper>
	)
}

export default Login;