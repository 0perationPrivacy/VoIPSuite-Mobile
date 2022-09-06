import React from 'react'
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements'
import styles from './style';

const Version = ({ customStyle = {}, text = 'v0.89' }) => {
	return (
		<View style={[styles.versionContainer, customStyle]}>
			<Text style={styles.versionText}>{text}</Text>
		</View>
	)
}

export default Version;