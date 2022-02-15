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
        paddingHorizontal: 10
    },
    homeHeaderPhone: {
        marginLeft: 5,
        marginRight: 10
    },
    homeHeaderProfileDropDown: {
        height: 'auto',
        marginTop : 10,
    },
});