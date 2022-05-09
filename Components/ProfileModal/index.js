import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import Modal from "react-native-modal";
import styles from './style';
import { useForm } from 'react-hook-form'
import CustomInput from '../Input';
import CustomButton from '../Button';

const CustomModal = ({ isVisible = false, onBackdropPress = () => { }, onPressSave = () => { }, ...rest }) => {
	const [profileName, setProfileName] = useState(null);
	const [errors, setErrors] = useState({});

	const { control, handleSubmit } = useForm();

	const onPress = (data) => {
		onPressSave(data, onSetErrorMessageFromServer);
	}

	const onSetErrorMessageFromServer = (errors) => {
		setErrors(errors);
	}

	useEffect(() => {
		// setValidate(Object.keys(errors).length === 0)
	}, [errors])

	return (
		<Modal
			isVisible={isVisible}
			animationType="slide"
			transparent={true}
			onBackdropPress={onBackdropPress}
		>
			<View style={styles.modalViewContainer}>
				<Text style={styles.modalTitle}>Add Profile</Text>
				<CustomInput
					placeholder="Enter Profile"
					onChangeInput={(text) => setProfileName(text)}
					control={control}
					name="profile"
					isError={errors?.profile}
				/>
				<CustomButton title={'Save'} onPress={handleSubmit(onPress)} />
			</View>
		</Modal>
	)
}

export default CustomModal;