'use strict';
import { StyleSheet } from 'react-native';
import Metrics from '../../helpers/Metrics';

module.exports = StyleSheet.create({
	versionContainer: {
		width: '100%',
		marginTop: Metrics.baseMargin,
	},
	versionText : {
		color : '#cacaca',
		textAlign : 'center',
		fontSize : Metrics.generatedFontSize(14)
	}
});