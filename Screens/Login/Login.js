import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import { useForm } from 'react-hook-form'
import { isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'

const Login = (props) => {
	const [params, setParams] = useState({ email: "", password: "", server_url: "" });
	const [isValidate, setValidate] = useState(false);
	const [errors, setErrors] = useState({});
	const [errorMessages, setErrorMessages] = useState({});

	const validations = {
		email: true,
		password: true,
	}

	const { control, handleSubmit } = useForm();

	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.authentication.isLoading);

	const onPressSignUp = () => {
		navigate('Signup');
	}

	const onPressSignIn = (data) => {
		const { email, password } = data;

		console.log(data);

		if (!isValidate) return false;

		if (isEmpty(email)) {
			setErrors(prevState => ({ ...prevState, email: true }));
			return false;
		}
		if (isEmpty(password)) {
			setErrors(prevState => ({ ...prevState, password: true }));
			return false;
		}

		dispatch(userActions.login(data, onSetErrorMessageFromServer))
	}

	const onInputLeave = (name, value) => {
		if (validations?.[name]) {
			let _errors = { ...errors };
			if (isEmpty(value)) {
				Object.assign(_errors, { [name]: true })
			}
			else { delete _errors[name] }

			setErrors(_errors);
		}

	}

	const onSetErrorMessageFromServer = (errors) => {
		console.log(errors,'error');
		setErrorMessages(errors);
	}

	useEffect(() => {
		setValidate(Object.keys(errors).length === 0)
	}, [errors])
console.log('huziazfa');
	return (
		<AuthWrapper>
			<Image source={logo} style={styles.ImageDimension} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Enter Email"
					autoFocus
					keyboardType="email-address"
					defaultValue={params.email}
					onChangeText={(text) => setUsername(text)}
					style={styles.inputWrap}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.email}
					errors={errorMessages}
					name="email"
				/>
				<Input
					placeholder="Enter Password"
					secureTextEntry
					type="password"
					defaultValue={params.password}
					onChangeText={(text) => setPassword(text)}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.password}
					errors={errorMessages}
					name="password"
				/>
				<Input
					placeholder="Enter Server Url (Optional)"
					keyboardType="url"
					defaultValue={params.password}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
				/>
			</View>
			<Button containerStyle={styles.button} title="Login" onPress={handleSubmit(onPressSignIn)} loading={isLoading} />
			<Button containerStyle={styles.button} title="Create Account" type="outline" onPress={onPressSignUp} />
		</AuthWrapper>
	)
}

export default Login;