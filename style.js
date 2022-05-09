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
		backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
		height: Metrics.heightPercentageToDP(100),
		paddingTop: Metrics.ratio(25)
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
		backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
		borderBottomWidth: 0.5,
		borderBottomColor: getColorByTheme('#2e2e2e', '#fff'),
	},
	homeHeaderPhone: {
		marginLeft: 5,
		// marginRight: 10
	},
	homeHeaderProfileDropDown: {
		// height: Metrics.ratio(50),
		marginTop: 10,
		// backgroundColor: '#000'
	},
	profileDropDownItemContainer: {
		backgroundColor: '#fff',
		// alignItems: 'center',
		paddingHorizontal: Metrics.buttonPadding,
		paddingVertical: Metrics.ratio(15)
	},

	//drawer
	drawerStyle: {
		backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
	},
	drawerContainer: {
		// flex: 1,
		paddingHorizontal: 10,
		paddingTop: 20,
	},
	drawerInnerHeading: {
		fontSize: 14,
		fontWeight: 'bold',
		color: getColorByTheme('#000', '#fff'),
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
		color: getColorByTheme('#000', '#fff'),
		fontSize: 16,
	},
	primaryBgColor: {
		backgroundColor: '#3770e4'
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '500',
		color: getColorByTheme('#000', '#fff'),
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
	defaultIconColor: {
		color: getColorByTheme('#000', '#fff'),
	},
	defaultTextColor: {
		color: getColorByTheme('#000', '#fff'),
	},
	themeBg: {
		backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
	},
});