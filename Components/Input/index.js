import React from 'react'
import { TextInput } from 'react-native'
import styles from './style';
import { useForm, useController } from 'react-hook-form'

const CustomInput = ({ customStyle = {}, control, name, ...rest }) => {
	const { field } = useController({
		control,
		defaultValue: '',
		name
	})

	return (
		<TextInput
			{...rest}
			style={[styles.inputContainer, customStyle]}
			underlineColorAndroid={'transparent'}
			onChangeText={field.onChange}
			value={field.value}
		/>
	)
}

export default CustomInput;