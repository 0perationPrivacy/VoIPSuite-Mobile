'use strict';
import { StyleSheet, Dimensions } from 'react-native';
import Metrics from './helpers/Metrics';
import { getColorByTheme } from './helpers/utils';
let ScreenHeight = Dimensions.get("window").height;

module.exports = StyleSheet.create({
	authContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
		// flex: 1,
		height: '100%',
		paddingHorizontal: Metrics.ratio(10),
	},
	flexOne: {
		flex: 1,
	},

	container: {
		padding: 10,
		backgroundColor: 'white',
		height: Metrics.heightPercentageToDP(100),
	},

	//home header
	fullFlex: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	homeHeaderWrapper: {
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: '#fff'
	},
	homeHeaderPhone: {
		marginLeft: 5,
		// marginRight: 10
	},
	homeHeaderProfileDropDown: {
		height: 'auto',
		marginTop: 10,
	},

	//drawer
	drawerContainer: {
		flex: 1,
		paddingHorizontal: 10,
		paddingTop: 20
	},
	drawerInnerHeading: {
		color: '#000',
		fontSize: 14,
		fontWeight: 'bold',
	},
	drawerMainItemWrap: {
		marginBottom: 15
	},
	drawerInnerChildWrap: {
		marginLeft: 10,
		marginTop: 15
	},
	drawerInnerChildListWrap: {
		flexDirection: 'row',
		marginBottom: 15
	},
	drawerInnerChildIcon: {
		marginRight: 5,
		alignSelf: 'center'
	},
	drawerInnerChildText: {
		color: '#000',
		fontSize: 16,
	},
	primaryBgColor: {
		backgroundColor: '#3770e4'
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '500',
		color: '#000'
	},
	textAreaContainer: {
		height: 200,
		textAlignVertical: 'top',
	},

	screenInnerTitle: {
		fontSize: Metrics.ratio(21),
		textAlign: 'center',
		color: getColorByTheme('#000', '#fff'),
	},
	defaultIconColor : {
		color: getColorByTheme('#000', '#fff'),
	},
	defaultTextColor : {
		color: getColorByTheme('#000', '#fff'),
	}
});