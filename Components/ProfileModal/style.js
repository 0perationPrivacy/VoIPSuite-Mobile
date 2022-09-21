'use strict';
import { StyleSheet } from 'react-native';
import Metrics from '../../helpers/Metrics'
import { getColorByTheme } from '../../helpers/utils';

const { ratio } = Metrics;

module.exports = StyleSheet.create({
	modalViewContainer: {
		backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
		paddingHorizontal: ratio(15),
		paddingBottom: Metrics.ratio(15)
	},
	modalTitle: {
		paddingVertical: ratio(15),
		fontSize: ratio(14),
		color: getColorByTheme('#000', '#fff')
	},
	inputContainer: { borderRadius: 10 }
});