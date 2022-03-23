import React, { useEffect, useState } from 'react'
import { View, KeyboardAvoidingView, StatusBar } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
import styles from '../authCss';
const logo = require('../../assets/logo-b.svg')
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'
import _ from 'lodash';
import { isEmpty } from '../../helpers/utils';

const SignUp = (props) => {
	const [params, setParams] = useState({ email: "", password: "", confirm_password: "", server_url: "" });
	const [isValidate, setValidate] = useState(false);
	const [errors, setErrors] = useState({});
	const [errorMessages, setErrorMessages] = useState({});

	const { control, handleSubmit } = useForm();

	const validations = {
		email: true,
		password: true,
		confirm_password: true,
	}

	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.registration.isLoading);

	const onPressLogin = () => {
		navigate('Login')
	}

	const onChangeInput = (name, value) => {
		setParams(prevState => ({ ...prevState, [name]: value }));
	}

	const onInputLeave = (name, value) => {
		if (validations?.[name]) {
			let _errors = { ...errors };
			if (isEmpty(value)) {
				Object.assign(_errors, { [name]: true })
			}
			else { delete _errors[name] }

			if (name === 'confirm_password' || name === 'password') {
				if (params.confirm_password != params.password) Object.assign(_errors, { confirm_password: true, password: true });
				else { delete _errors.confirm_password; delete _errors.password }
			}

			setErrors(_errors);
		}

	}

	const onSetErrorMessageFromServer = (errors) => {
		console.log(errors);
		setErrorMessages(errors);
	}

	useEffect(() => {
		setValidate(Object.keys(errors).length === 0)
	}, [errors])

	const onPressSignup = (data) => {
		const { email, password, confirm_password } = params;

		if (!isValidate) return false;

		if (isEmpty(email)) {
			setErrors(prevState => ({ ...prevState, email: true }));
			return false;
		}
		if (isEmpty(password) || password != confirm_password) {
			setErrors(prevState => ({ ...prevState, password: true }));
			return false;
		}

		dispatch(userActions.register(data, onSetErrorMessageFromServer))
	}

	return (
		<AuthWrapper>
			<StatusBar style="light" />
			<Image source={logo} style={styles.ImageDimension} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Enter Username"
					autoFocus
					keyboardType="email-address"
					defaultValue={params.email}
					control={control}
					name="email"
					onChangeInput={onChangeInput}
					onInputLeave={onInputLeave}
					isError={errors?.email}
					errors={errorMessages}
				/>
				<Input
					placeholder="Enter Password"
					secureTextEntry
					type="password"
					defaultValue={params.password}
					control={control}
					name="password"
					onChangeInput={onChangeInput}
					onInputLeave={onInputLeave}
					isError={errors?.password}
					errors={errorMessages}
				/>
				<Input
					placeholder="Confirm Password"
					secureTextEntry
					type="password"
					defaultValue={params.confirm_password}
					control={control}
					name="confirm_password"
					onChangeInput={onChangeInput}
					onInputLeave={onInputLeave}
					isError={errors?.confirm_password}
					errors={errorMessages}
				/>
				<Input
					placeholder="Enter Server Url (Optional)"
					keyboardType="url"
					defaultValue={params.server_url}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onSubmitEditing={handleSubmit(onPressSignup)}
					name="server_url"
					onChangeInput={onChangeInput}
					onInputLeave={onInputLeave}
				/>
			</View>

			<Button containerStyle={styles.button} title="Sign Up" onPress={handleSubmit(onPressSignup)} loading={isLoading} />
			<Button containerStyle={styles.button} title="Login" type="outline" onPress={onPressLogin} />
		</AuthWrapper>

	)
}

export default SignUp;