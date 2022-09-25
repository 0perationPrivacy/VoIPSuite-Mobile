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
		// height: Metrics.heightPercentageToDP(100),
		paddingTop: Metrics.ratio(25)

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
	},
	homeHeaderLeftContainer: {
		flexDirection: 'row',
		// justifyContent: 'center',
		alignItems: 'center',
	},
	homeHeaderAppTitle: {
		marginLeft: '10%',
		fontSize: 16,
		color: getColorByTheme('#000', '#fff'),
		fontFamily: Metrics.fontMedium,
	},
	homeHeaderPhone: {
		marginLeft: 5,
		// marginRight: 10
	},
	homeHeaderProfileDropDown: {
		height: '50%',
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
	drawerMainContainer: {
		paddingHorizontal: 10,
		paddingTop: 20,

	},
	drawerContainer: {
		// flex: 1,
		// backgroundColor  :'red',
		height: ScreenHeight - 200
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
		borderRadius: 10
	},

	screenInnerTitle: {
		fontSize: Metrics.ratio(21),
		textAlign: 'center',
		color: getColorByTheme('#000', '#fff'),
		fontFamily: Metrics.fontMedium
	},
	defaultIconColor: {
		color: getColorByTheme('#000', '#6c757d'),
	},
	defaultTextColor: {
		color: getColorByTheme('#000', '#fff'),
		fontFamily: Metrics.fontRegular
	},
	themeBg: {
		backgroundColor: getColorByTheme('#fff', '#121212'),
	},
	authInputContainer: {
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
	},
	authInputIconContainer: {
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
	}
});