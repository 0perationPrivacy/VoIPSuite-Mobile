import React, { useEffect, useState } from 'react'
import { Text, View, Linking, TouchableOpacity } from 'react-native'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import globalStyle from '../../style';
import { useForm } from 'react-hook-form'
import { isEmpty, validURL } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Metrics from '../../helpers/Metrics';
import Version from '../../components/Version';
import { API_PREFIX } from '../../helpers/config';

const Login = (props) => {
	const [params, setParams] = useState({ email: "", password: "", server_url: "" });
	const [isValidate, setValidate] = useState(false);
	const [errors, setErrors] = useState({});
	const [errorMessages, setErrorMessages] = useState({});

	const validations = {
		email: { validation: true },
		password: { validation: true },
		server_url: { validation: true, cb: validURL },
	}

	const { control, handleSubmit } = useForm();

	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.authentication.isLoading);

	// useEffect(() => {
	// 	const state = store.getState();
	// 	const { user } = state?.authentication;	
	// }, [])

	const onPressSignUp = () => {
		navigate('Signup');
	}

	const onPressSignIn = (data) => {
		const { email, password, server_url } = data;
		if (!isValidate) return false;

		if (isEmpty(email)) {
			setErrors(prevState => ({ ...prevState, email: true }));
			return false;
		}
		if (isEmpty(password)) {
			setErrors(prevState => ({ ...prevState, password: true }));
			return false;
		}

		if (!isEmpty(server_url)) {
			data.server_url = server_url;
		}

		dispatch(userActions.login(data, onSetErrorMessageFromServer))
	}

	const onInputLeave = (name, value) => {
		let objKey = validations?.[name];
		if (objKey?.validation == true) {
			let _errors = { ...errors };
			let cb = objKey?.cb;
			let isValidated = true;

			if (cb && typeof cb == 'function') {
				if (!isEmpty(value) && !cb(value)) {
					isValidated = false;
				}
			}
			else {
				if (isEmpty(value)) {
					isValidated = false;
				}
			}

			if (isValidated) {
				delete _errors[name]
			} else {
				Object.assign(_errors, { [name]: true })
			}

			setErrors(_errors);
		}

	}

	const onSetErrorMessageFromServer = (errors) => {
		setErrorMessages(errors);
	}

	useEffect(() => {
		console.log(errors);
		setValidate(Object.keys(errors).length === 0)
	}, [errors])

	const openUrlLink = (link) => {
		Linking.openURL(link);
	}

	const onChangeServerUrl = (name, value) => {
		console.log(value, validURL(value));
	}

	return (
		<AuthWrapper>
			{/* <Image source={logo} style={styles.ImageDimension} /> */}
			<View style={styles.authContainerCard}>
				<Text style={globalStyle.screenInnerTitle}>Login</Text>
				<View style={styles.inputContainer}>
					<Input
						placeholder="Enter Username"
						// autoFocus
						defaultValue={params.email}
						style={styles.inputWrap}
						control={control}
						onInputLeave={onInputLeave}
						isError={errors?.email}
						errors={errorMessages}
						name="email"
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
						onInputLeave={onInputLeave}
						isError={errors?.password}
						errors={errorMessages}
						name="password"
						icon={'shield'}
						customStyle={globalStyle.authInputContainer}
						customIconWrap={globalStyle.authInputIconContainer}
						customSecureIconWrap={globalStyle.authSecureIconContainer}
					// customStyle={}
					/>
					<View style={styles.serverUrlWrapper}>
						<Input
							placeholder="https://voip.operationprivacy.com"
							keyboardType="url"
							defaultValue={params.server_url}
							control={control}
							name="server_url"
							onInputLeave={onInputLeave}
							customStyle={{ borderRadius: 10, marginBottom: 0 }}
							customIconWrap={globalStyle.authInputIconContainer}
							onChangeInput={onChangeServerUrl}
						/>
						{
							errors?.server_url && <Text style={[styles.serverUrlHintText, styles.fieldErrorMessage]}>{"Incorrect URL"}</Text>
						}
						<Text style={styles.serverUrlHintText}>{"Pattern : https://voip.operationprivacy.com"}</Text>
					</View>
				</View>
				<Button
					containerStyle={styles.button}
					buttonStyle={styles.signInButton}
					title="Login"
					onPress={handleSubmit(onPressSignIn)}
					loading={isLoading}
				/>
				<View style={styles.createAccountWrap}>
					<Text style={globalStyle.defaultTextColor}>Don’t have an account yet?</Text>
					<TouchableOpacity onPress={onPressSignUp}>
						<Text style={styles.createAccountText} >Sign up</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.socialLinksWrap}>
					<TouchableOpacity style={styles.socialLinksItem} onPress={() => openUrlLink('https://www.twitter.com/0perationP')}>
						<FontAwesome5 name="twitter" size={Metrics.ratio(30)} style={globalStyle.defaultIconColor} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialLinksItem} onPress={() => openUrlLink('https://github.com/0perationPrivacy/')}>
						<FontAwesome5 name="github" size={Metrics.ratio(30)} style={globalStyle.defaultIconColor} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialLinksItem} onPress={() => openUrlLink('https://www.operationprivacy.com/donate')}>
						<FontAwesome5 name="credit-card" size={Metrics.ratio(30)} style={globalStyle.defaultIconColor} />
					</TouchableOpacity>
				</View>
			</View>
			<Version />
		</AuthWrapper>
	)
}

export default Login;