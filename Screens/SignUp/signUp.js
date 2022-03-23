import React, { useState } from 'react'
import { View, KeyboardAvoidingView, StatusBar } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
import styles from '../authCss';
const logo = require('../../assets/logo-b.svg')
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'

const SignUp = (props) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [serverUrl, setServerUrl] = useState('')
	const { control, handleSubmit } = useForm();

	const dispatch = useDispatch();
	// const types = useSelector(state => state.users.types);
	// const loggingIn = useSelector(state => state.authentication.loggingIn);

	const onPressLogin = () => {
		navigate('Login')
	}

	const onPressSignup = (data) => {
		dispatch(userActions.register(data))
	}

	return (
		<AuthWrapper>
			<StatusBar style="light" />
			<Image source={logo} style={styles.ImageDimension} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Enter Username"
					autoFocus
					type="email"
					value={username}
					onChangeText={(text) => setUsername(text)}
					control={control}
					name="email"
				/>
				<Input
					placeholder="Enter Password"
					secureTextEntry
					type="password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					control={control}
					name="password"
				/>
				<Input
					placeholder="Confirm Password"
					secureTextEntry
					type="password"
					value={confirmPassword}
					onChangeText={(text) => setConfirmPassword(text)}
					control={control}
					name="confirm_password"
				/>
				<Input
					placeholder="Enter Server Url (Optional)"
					type="text"
					value={serverUrl}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onSubmitEditing={handleSubmit(onPressSignup)}
					name="server_url"
				/>
			</View>

			<Button containerStyle={styles.button} title="Sign Up" onPress={handleSubmit(onPressSignup)} />
			<Button containerStyle={styles.button} title="Login" type="outline" onPress={onPressLogin} />
		</AuthWrapper>

	)
}

export default SignUp;