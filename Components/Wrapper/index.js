import React from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../style';
import CustomHeader from '../Header';

const Wrapper = ({ children }) => {
	return (
		<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
			<CustomHeader />
			<ScrollView contentContainerStyle={styles.container}>
				{children}
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

export default Wrapper;