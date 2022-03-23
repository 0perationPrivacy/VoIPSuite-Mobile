import React from 'react'
import { TextInput } from 'react-native'
import styles from './style';
import { useForm, useController } from 'react-hook-form'

const CustomInput = ({ customStyle = {}, control, name, onChangeInput, onInputLeave, isError, errors, ...rest }) => {
	const { field } = useController({
		control,
		defaultValue: '',
		name,
	})

	const onChangeInputText = (text) => {
		const { onChange } = field;
		onChange(text);

		if (onChangeInput) {
			onChangeInput(name, text)
		}
	}

	const _onInputLeave = (event) => {
		if (onInputLeave) {
			onInputLeave(name, event.nativeEvent.text)
		}
	}

	return (
		<TextInput
			{...rest}
			style={[styles.inputContainer, customStyle, isError || errors?.[name] ? styles.error : '']}
			underlineColorAndroid={'transparent'}
			onChangeText={onChangeInputText}
			onBlur={_onInputLeave}
		/>
	)
}

export default CustomInput;