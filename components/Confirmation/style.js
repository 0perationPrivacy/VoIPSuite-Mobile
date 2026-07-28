'use strict';
import { StyleSheet } from 'react-native';
import Metrics from '../../helpers/Metrics'

const { ratio } = Metrics;

module.exports = StyleSheet.create({
	modalViewContainer: {
		// height: '50%',
		backgroundColor: '#fff',
		paddingHorizontal: ratio(15),
	},
	modalTitle: {
		paddingVertical: ratio(15),
		// paddingLeft: ratio(15),
		fontSize: ratio(28),
		textAlign: 'center'
	},
	modalDescription: {
		fontSize: ratio(18),
		textAlign: 'center'
	},
	confirmationBoxContainer: {
		flexDirection: 'row',
		marginVertical: ratio(15),
		justifyContent : 'space-evenly'
	}
});