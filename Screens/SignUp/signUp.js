import React, { useEffect, useState } from 'react'
import { View, KeyboardAvoidingView, StatusBar, Text, TouchableOpacity } from 'react-native'
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
import globalStyle from '../../style';
import Icon from 'react-native-vector-icons/Feather'
import Metrics from '../../helpers/Metrics';

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
			{/* <StatusBar style="light" /> */}
			<View style={styles.authContainerCard}>
				{/* <Image source={logo} style={styles.ImageDimension} /> */}
				<Text style={globalStyle.screenInnerTitle}>Signup</Text>
				<View style={styles.inputContainer}>
					<Input
						placeholder="Enter Username"
						// autoFocus
						defaultValue={params.email}
						control={control}
						name="email"
						onChangeInput={onChangeInput}
						onInputLeave={onInputLeave}
						isError={errors?.email}
						errors={errorMessages}
						icon={'user'}
						customStyle={globalStyle.authInputContainer}
						customIconWrap={globalStyle.authInputIconContainer}
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
						icon={'shield'}
						customStyle={globalStyle.authInputContainer}
						customIconWrap={globalStyle.authInputIconContainer}
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
						icon={'shield'}
						customStyle={globalStyle.authInputContainer}
						customIconWrap={globalStyle.authInputIconContainer}
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
						customStyle={{ borderRadius: 10 }}
						customIconWrap={globalStyle.authInputIconContainer}
					/>
				</View>

				<Button containerStyle={styles.button} buttonStyle={styles.signInButton} title="Sign Up" onPress={handleSubmit(onPressSignup)} loading={isLoading} />
				<View style={styles.createAccountWrap}>
					<Text style={globalStyle.defaultTextColor}>Already have an account? </Text>
					<TouchableOpacity onPress={onPressLogin}>
						<Text style={styles.createAccountText} >Login</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.socialLinksWrap}>
					<TouchableOpacity style={styles.socialLinksItem}>
						<Icon name="twitter" size={Metrics.ratio(30)} style={globalStyle.defaultIconColor} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialLinksItem}>
						<Icon name="github" size={Metrics.ratio(30)} style={globalStyle.defaultIconColor} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialLinksItem}>
						<Icon name="credit-card" size={Metrics.ratio(30)} style={globalStyle.defaultIconColor} />
					</TouchableOpacity>
				</View>
			</View>
		</AuthWrapper>

	)
}

export default SignUp;