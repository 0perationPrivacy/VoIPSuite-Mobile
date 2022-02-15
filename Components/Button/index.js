import React from 'react'
import { Button } from 'react-native-elements'
import styles from './style';

const CustomButton = ({ customStyle = {}, ...rest }) => {
	return (
		<Button
			{...rest}
			style={[styles.buttonContainer, customStyle]}
		/>
	)
}

export default CustomButton;