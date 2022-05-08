'use strict';
import { StyleSheet } from 'react-native';
import Metrics from '../../helpers/Metrics'

const { ratio } = Metrics;

module.exports = StyleSheet.create({
	modalViewContainer: {
		height: '30%',
		backgroundColor: '#fff',
		paddingHorizontal: ratio(15),
	},
	modalTitle: {
		paddingVertical: ratio(15),
		// paddingLeft: ratio(15),
		fontSize: ratio(14)
	}
});