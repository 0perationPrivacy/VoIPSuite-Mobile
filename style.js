'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
	authContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		backgroundColor: 'white',
		flex: 1,
	},
	flexOne: {
		flex: 1,
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
		marginRight: 10
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
		fontSize: 18,
		fontWeight: 'bold'
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
	}
});