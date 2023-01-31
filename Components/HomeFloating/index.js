import React from 'react'
import { View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather';
import styles from './style';

const HomeFloating = ({
	customStyle = {},
	buttonStyle = {},
	onPressCompose = () => { },
	...rest
}) => {
	return (
		<View>
			{/* <TouchableOpacity style={styles.iconContainer}>
				<Icon name='phone' size={20} color='#fff' />
			</TouchableOpacity> */}
			<TouchableOpacity onPress={onPressCompose} style={[styles.iconContainer, styles.iconContainerContact]}>
				<Icon name='plus-circle' size={20} color='#fff' />
			</TouchableOpacity>
		</View>
	)
}

export default HomeFloating;