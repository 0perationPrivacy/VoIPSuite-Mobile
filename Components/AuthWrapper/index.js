// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../style';

const AuthWrapper = ({ children }) => {
	return (
		// <KeyboardAvoidingView behavior="padding" style={styles.authContainer}>
		// 	{/* <ScrollView contentContainerStyle={styles.authContainer}> */}
		// 	{children}
		// 	<View style={{ height: 100 }} />
		// 	{/* </ScrollView> */}
		// </KeyboardAvoidingView>

		<View behavior="padding" style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={styles.container}>
				{children}
			</ScrollView>
		</View>
	)
}

export default AuthWrapper;