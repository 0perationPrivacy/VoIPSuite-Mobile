import React from 'react'
import { TextInput, View } from 'react-native'
import styles from './style';
import { useForm, useController } from 'react-hook-form'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getColorByTheme } from '../../helpers/utils';

const CustomInput = ({
	customStyle = {},
	control, name,
	onChangeInput, onInputLeave,
	defaultValue,
	isError, errors, icon = null, ...rest
}) => {

	const { field } = useController({
		control,
		defaultValue,
		name,
	})

	const onChangeInputText = (text) => {
		const { onChange } = field;
		onChange(text);
		// console.log('afzffzfzf',text,name,onChangeInput)
		
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
				icon && <View style={[styles.iconWrap, isError || errors?.[name] ? styles.error : '',]}>
					<Icon name={icon} size={20} />
				</View>
			}
			<TextInput
				{...rest}
				style={[styles.inputContainer, customStyle, isError || errors?.[name] ? styles.error : '', icon ? styles.noLeftBorderInput : styles.fullflex]}
				underlineColorAndroid={'transparent'}
				onChangeText={onChangeInputText}
				// onBlur={_onInputLeave}
				onEndEditing={_onInputLeave}
				placeholderTextColor={getColorByTheme('#000', '#fff')}
				defaultValue={defaultValue}
			/>
		</View>
	)
}

export default CustomInput;