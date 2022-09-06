'use strict';
import { StyleSheet } from 'react-native';
import { getColorByTheme } from '../../helpers/utils';

module.exports = StyleSheet.create({
	mainWrap: {
		flexDirection: 'row',
	},
	inputContainer: {
		borderWidth: 1,
		borderColor: '#ececec',
		fontSize: 14,
		padding: 5,
		marginBottom: 15,
		height: 45,
		flex: 0.9,
		color: getColorByTheme('#000', '#fff')
	},
	iconWrap: {
		justifyContent: 'center',
		height: 45,
		padding: 5,
		flex: 0.1,
		alignItems: 'center',
		backgroundColor: '#cacaca'
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