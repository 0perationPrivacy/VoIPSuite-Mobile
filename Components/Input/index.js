import React, { useEffect, useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import styles from './style';
import { useForm, useController } from 'react-hook-form'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getColorByTheme } from '../../helpers/utils';

const CustomInput = ({
	customStyle = {},
	control, name,
	onChangeInput, onInputLeave,
	defaultValue,
	isError, errors,
	customIconWrap = {},
	secureTextEntry = false,
	customSecureIconWrap = {},
	icon = null, ...rest
}) => {

	const [isSecure, setIsSecure] = useState(false);

	useEffect(() => {
		if (secureTextEntry) {
			setIsSecure(secureTextEntry);
		}
	}, [secureTextEntry])

	const { field } = useController({
		control,
		defaultValue,
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
		<View style={styles.mainWrap}>
			{
				icon && <View style={[styles.iconWrap, isError || errors?.[name] ? styles.error : '', customIconWrap]}>
					<Icon name={icon} size={20} />
				</View>
			}
			<TextInput
				{...rest}
				style={[styles.inputContainer, customStyle, isError || errors?.[name] ? styles.error : '', icon ? styles.noLeftBorderInput : styles.fullflex, secureTextEntry ? styles.noRightBorderInput : styles.fullflex]}
				underlineColorAndroid={'transparent'}
				onChangeText={onChangeInputText}
				// onBlur={_onInputLeave}
				onEndEditing={_onInputLeave}
				placeholderTextColor={getColorByTheme('#000', '#fff')}
				defaultValue={defaultValue}
				secureTextEntry={isSecure}
			/>
			{
				secureTextEntry &&
				<TouchableOpacity style={[styles.iconWrap, isError || errors?.[name] ? styles.error : '', customSecureIconWrap]} onPress={() => { setIsSecure(!isSecure) }}>
					<Icon name={isSecure ? 'eye' : 'eye-slash'} size={20} />
				</TouchableOpacity>
			}
		</View>
	)
}

export default CustomInput;