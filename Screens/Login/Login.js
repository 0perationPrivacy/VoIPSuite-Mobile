import React, { useEffect, useState } from 'react'
import { Text, View, Linking, TouchableOpacity } from 'react-native'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import globalStyle from '../../style';
import { useForm } from 'react-hook-form'
import { isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Metrics from '../../helpers/Metrics';
import Version from '../../components/Version';
import { DEFAUL_URL } from '../../helpers/config';

const Login = (props) => {
	const [params, setParams] = useState({ email: "", password: "", server_url: DEFAUL_URL });
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

	// useEffect(() => {
	// 	const state = store.getState();
	// 	const { user } = state?.authentication;
	// }, [])

	const onPressSignUp = () => {
		navigate('Signup');
	}

	const onPressSignIn = (data) => {
		const { email, password } = data;
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
		setErrorMessages(errors);
	}

	useEffect(() => {
		setValidate(Object.keys(errors).length === 0)
	}, [errors])

	const openUrlLink = (link) => {
		Linking.openURL(link);
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
						/>
						<Text style={styles.serverUrlHintText}>{"Pattern : https://voip.operationprivacy.com"}</Text>
					</View>
				</View>
				<Button containerStyle={styles.button} buttonStyle={styles.signInButton} title="Login" onPress={handleSubmit(onPressSignIn)} loading={isLoading} />
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