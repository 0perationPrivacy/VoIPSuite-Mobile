import React from 'react'
import { Button } from 'react-native-elements'
import styles from './style';

const CustomButton = ({ customStyle = {}, buttonStyle = {}, ...rest }) => {
	return (
		<Button
			{...rest}
			style={[styles.buttonContainer, customStyle]}
			buttonStyle={buttonStyle}
		/>
	)
}

export default CustomButton;