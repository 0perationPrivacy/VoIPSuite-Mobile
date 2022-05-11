import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button, Header } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import globalStyle from '../../style';
import { useForm } from 'react-hook-form'
import { getColorByTheme, isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { emailActions, userActions } from '../../redux/actions'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'
import Metrics from '../../helpers/Metrics';
import Wrapper from '../../components/Wrapper';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';

const EmailSettings = (props) => {
	const [params, setParams] = useState({ email: "", password: "", sender_email: "", to_email: "", host: "", port: "", is_secure: false });
	const [isValidate, setValidate] = useState(false);
	const [errors, setErrors] = useState({});
	const [errorMessages, setErrorMessages] = useState({});

	const validations = {
		email: true,
		password: true,
		sender_email: true,
		to_email: true,
		host: true,
		port: true,
	}

	const { control, handleSubmit } = useForm();

	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.email.isLoading);

	const onPressSignUp = () => {
		navigate('Signup');
	}

	const onPressSaveEmail = (data) => {

		if (!isValidate) return false;

		// if (isEmpty(username)) {
		// 	setErrors(prevState => ({ ...prevState, email: true }));
		// 	return false;
		// }
		// if (isEmpty(password)) {
		// 	setErrors(prevState => ({ ...prevState, password: true }));
		// 	return false;
		// }

		dispatch(emailActions.createEmailCredAction(data, onSetErrorMessageFromServer))
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

	const onSetErrorMessageFromServer = (_errors) => {
		console.log(_errors,'s')
		setErrors(_errors);
	}

	useEffect(() => {
		console.log(errors,'ss')
		setValidate(Object.keys(errors).length === 0)
	}, [errors])

	const onChangeSecure = (e) => {
		let secure = params.is_secure;

		setParams({ is_secure: !secure })
	}

	const renderHeader = () => {
		return <Header title={'Email Settings'} />
	}

	return (
		<Wrapper header={renderHeader()}>
			<View>
				<Input
					placeholder="Enter Username"
					keyboardType="url"
					defaultValue={params.email}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.email}
					name="email"
				/>
				<Input
					placeholder="Enter Password"
					keyboardType="url"
					defaultValue={params.password}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
					secureTextEntry
					type="password"
					isError={errors?.password}
					name="password"
				/>
				<Input
					placeholder="Enter FROM"
					keyboardType={"email-address"}
					defaultValue={params.sender_email}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.sender_email}
					name="sender_email"
				/>
				<Input
					placeholder="Enter TO"
					keyboardType={"email-address"}
					defaultValue={params.to_email}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.to_email}
					name="to_email"
				/>
				<Input
					placeholder="Enter Host (smtp.domain.com)"
					keyboardType="url"
					defaultValue={params.host}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.host}
					name="host"
				/>
				<Input
					placeholder="Enter Port (465 or 587)"
					keyboardType="url"
					defaultValue={params.port}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.port}
					name="port"
				/>
				<CheckBox title="Secure"
					containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
					textStyle={{ color: getColorByTheme("#000", "#fff") }}
					onPress={onChangeSecure}
					checked={params.is_secure}
					checkedColor={getColorByTheme("#000", "#fff")} />
			</View>
			<Button containerStyle={styles.button} buttonStyle={styles.signInButton} title="Login" onPress={handleSubmit(onPressSaveEmail)} loading={isLoading} />
		</Wrapper>
	)
}

export default EmailSettings;