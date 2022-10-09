import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Input, Button, Header } from '../../components';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import { useForm } from 'react-hook-form'
import { getColorByTheme, isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { emailActions, profileActions } from '../../redux/actions'
import Wrapper from '../../components/Wrapper';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';
import _ from 'lodash';

const EmailSettings = (props) => {
	const [params, setParams] = useState({ email: "", password: "", sender_email: "", to_email: "", host: "", port: "", is_secure: false });
	const [isValidate, setValidate] = useState(false);
	const [errors, setErrors] = useState({});
	const [errorMessages, setErrorMessages] = useState({});
	const [isEmailInfo, setEmailInfo] = useState(false);

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
	const settings = useSelector(state => state.email.settings);
	const isLoading = useSelector(state => state.email.isLoading);
	const profiles = useSelector(state => state.profile.items);

	useEffect(() => {
		getEmailSettings();
	}, [])

	useEffect(() => {
		if (!_.isEmpty(settings)) {
			setParams(settings);
			setEmailInfo(true);
		}
	}, [settings])

	const getEmailSettings = () => {
		dispatch(emailActions.getEmailSettingsAction())
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
		dispatch(emailActions.createEmailCredAction(params, onSetErrorMessageFromServer))
	}

	const onPressChangeProfileEmailSettings = (id, isChecked) => {
		let status = isChecked ? 'false' : 'true';
		let data = { setting_id: id, status }

		dispatch(emailActions.saveProfileEmailSettingsAction(data, onSuccessProfleSettingsSave))
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
		setErrors(_errors);
	}

	const onChangeInputs = (name, val) => {
		setParams(prevState => ({ ...prevState, [name]: val }));
	}

	const onSuccessProfleSettingsSave = (profile) => {
		const { emailnotification, id } = profile;
		let __profiles = [...profiles];
	
		const returnProfile = __profiles.filter((item) => {
			if (item.id === id) {
				item.emailnotification = emailnotification;
				return true
			}
		})
	
		dispatch(profileActions.setProfileList(__profiles))
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

	const renderProfileList = () => {
		return (
			profiles && profiles.map((item, index) => {
				const { profile, emailnotification, id } = item;
				let isChecked = emailnotification === 'true' ? true : false;

				return (
					<View key={index}>
						<CheckBox
							title={profile}
							containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
							textStyle={{ color: getColorByTheme("#000", "#fff") }}
							onPress={() => onPressChangeProfileEmailSettings(id, isChecked)}
							checked={isChecked}
							checkedColor={getColorByTheme("#000", "#fff")} />
					</View>
				)
			})
		)
	}

	return (
		<Wrapper header={renderHeader()}>
			<View>
				<Input
					placeholder="Enter Username"
					keyboardType="url"
					defaultValue={params.email}
					onChangeInput={onChangeInputs}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.email}
					name="email"
				/>
				<Input
					placeholder="Enter Password"
					keyboardType="url"
					defaultValue={params.password}
					onChangeInput={onChangeInputs}
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
					onChangeInput={onChangeInputs}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.sender_email}
					name="sender_email"
				/>
				<Input
					placeholder="Enter TO"
					keyboardType={"email-address"}
					defaultValue={params.to_email}
					onChangeInput={onChangeInputs}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.to_email}
					name="to_email"
				/>
				<Input
					placeholder="Enter Host (smtp.domain.com)"
					keyboardType="url"
					defaultValue={params.host}
					onChangeInput={onChangeInputs}
					control={control}
					onInputLeave={onInputLeave}
					isError={errors?.host}
					name="host"
				/>
				<Input
					placeholder="Enter Port (465 or 587)"
					keyboardType="url"
					defaultValue={params.port}
					onChangeInput={onChangeInputs}
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
			<Button containerStyle={styles.button} buttonStyle={styles.signInButton} title="Save" onPress={handleSubmit(onPressSaveEmail)} loading={isLoading} />
			{isEmailInfo && renderProfileList()}
		</Wrapper>
	)
}

export default EmailSettings;