import React from 'react'
import { TextInput } from 'react-native'
import styles from './style';

const CustomInput = ({ customStyle = {}, ...rest }) => {
	return (
		<TextInput
			{...rest}
			style={[styles.inputContainer, customStyle]}
		/>
	)
}

export default CustomInput;