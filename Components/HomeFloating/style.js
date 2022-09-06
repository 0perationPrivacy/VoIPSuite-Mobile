'use strict';
import { StyleSheet } from 'react-native';
import Metrics from '../../helpers/Metrics';

module.exports = StyleSheet.create({
	iconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		position: 'absolute',
		bottom: Metrics.bottomButtonHeight + Metrics.doubleBaseMargin,
		right: 10,
		backgroundColor: '#6681d1',
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 6,
	},
	iconContainerContact: {
		bottom: Metrics.doubleBaseMargin,
	}
});