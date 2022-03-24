'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
	mainWrap: {
		flexDirection: 'row'
	},
	inputContainer: {
		borderWidth: 1,
		borderColor: '#ececec',
		fontSize: 16,
		padding: 5,
		marginBottom: 15,
		height: 45,
		flex: 0.9
	},
	iconWrap: {
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#ececec',
		height: 45,
		padding: 5,
		borderRightWidth: 0,
		flex: 0.1,
		alignItems: 'center',
		backgroundColor : '#cacaca'
	},
	error: {
		borderColor: 'red',
		borderWidth: 2
	},
	noLeftBorderInput: {
		borderLeftWidth: 0
	},
	fullflex: {
		flex: 1
	}
});