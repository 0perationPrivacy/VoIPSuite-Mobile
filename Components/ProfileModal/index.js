import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import Modal from "react-native-modal";
import styles from './style';
import { useForm } from 'react-hook-form'
import CustomInput from '../Input';
import CustomButton from '../Button';

const CustomModal = ({ isVisible = false, onBackdropPress = () => { }, onPressSave = () => { }, ...rest }) => {
	const [profileName, setProfileName] = useState('');
	const { control, handleSubmit } = useForm();

	const onPress = () => {
		let data = { profile : profileName };
		onPressSave(data);
	}

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
					onChangeText={(text) => setProfileName(text)}
					control={control}
					name="profile_name"
				/>
				<CustomButton title={'Save'} onPress={onPress} />
			</View>
		</Modal>
	)
}

export default CustomModal;