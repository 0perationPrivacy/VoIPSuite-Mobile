import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import Modal from "react-native-modal";
import styles from './style';
import { useForm } from 'react-hook-form'
import CustomInput from '../Input';
import CustomButton from '../Button';

const Confirmation = ({
	isVisible = false, isLoading = false,
	onBackdropPress = () => { },
	onPressOk = () => { },
	onPressCancel = () => { },
	title = 'Call Setting',
	description = 'The call setting is already available. Do you want to override the call setting?',
	okText = 'Yes, override it',
	cancelText = 'No, Keep Old',
	...rest }) => {

	return (
		<Modal
			isVisible={isVisible}
			animationType="slide"
			transparent={true}
			onBackdropPress={onBackdropPress}
		>
			<View style={styles.modalViewContainer}>
				<Text style={styles.modalTitle}>{title}</Text>
				<Text style={styles.modalDescription}>{description}</Text>
				<View style={styles.confirmationBoxContainer}>
					<CustomButton title={okText} buttonStyle={{ backgroundColor: '#7367f0' }} onPress={onPressOk} />
					<CustomButton title={cancelText} buttonStyle={{ backgroundColor: '#ea5455' }} onPress={onPressCancel} />
				</View>
			</View>
		</Modal>
	)
}

export default Confirmation;