import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button, Header } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import globalStyle from '../../style';
import { useForm } from 'react-hook-form'
import { isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'
import Metrics from '../../helpers/Metrics';
import Wrapper from '../../components/Wrapper';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';

const EmailSettings = (props) => {
	const [params, setParams] = useState({ username: "", password: "", from: "", to: "", host: "", port: "", is_secure: false });
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
		// const { email, password } = data;

		// console.log(data);

		// if (!isValidate) return false;

		// if (isEmpty(email)) {
		// 	setErrors(prevState => ({ ...prevState, email: true }));
		// 	return false;
		// }
		// if (isEmpty(password)) {
		// 	setErrors(prevState => ({ ...prevState, password: true }));
		// 	return false;
		// }

		// dispatch(userActions.login(data, onSetErrorMessageFromServer))
	}

	const onInputLeave = (name, value) => {
		// if (validations?.[name]) {
		// 	let _errors = { ...errors };
		// 	if (isEmpty(value)) {
		// 		Object.assign(_errors, { [name]: true })
		// 	}
		// 	else { delete _errors[name] }

		// 	setErrors(_errors);
		// }

	}

	const onSetErrorMessageFromServer = (errors) => {
		setErrorMessages(errors);
	}

	useEffect(() => {
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
				{/* <Input
					placeholder="Enter Username"
					autoFocus
					defaultValue={params.email}
					onChangeText={(text) => setUsername(text)}
					style={styles.inputWrap}
					control={control}
					onInputLeave={onInputLeave}
					// isError={errors?.email}
					// errors={errorMessages}
					name="email"
				/> */}
				<Input
					placeholder="Enter Username"
					keyboardType="url"
					defaultValue={params.username}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
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
				/>
				<Input
					placeholder="Enter FROM"
					keyboardType="url"
					defaultValue={params.from}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
				/>
				<Input
					placeholder="Enter TO"
					keyboardType="url"
					defaultValue={params.to}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
				/>
				<Input
					placeholder="Enter Host (smtp.domain.com)"
					keyboardType="url"
					defaultValue={params.host}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
				/>
				<Input
					placeholder="Enter Port (465 or 587)"
					keyboardType="url"
					defaultValue={params.port}
					onChangeText={(text) => setServerUrl(text)}
					control={control}
					onInputLeave={onInputLeave}
				/>
				<CheckBox title="Secure"
					containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
					textStyle={{ color: "#fff" }}
					onPress={onChangeSecure}
					checked={params.is_secure}
					checkedColor={'#fff'} />
			</View>
			<Button containerStyle={styles.button} buttonStyle={styles.signInButton} title="Login" onPress={handleSubmit(onPressSignIn)} loading={isLoading} />
		</Wrapper>
	)
}

export default EmailSettings;