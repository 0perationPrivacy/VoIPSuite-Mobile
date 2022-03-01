import React, { react } from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../style';
import PropTypes from 'prop-types'

const Wrapper = ({ children, header }) => {
	return (
		<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
			{header}
			<ScrollView contentContainerStyle={styles.container}>
				{children}
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

Wrapper.defaultProps = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

export default Wrapper;