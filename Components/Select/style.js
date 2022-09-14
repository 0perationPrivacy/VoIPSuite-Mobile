'use strict';
import { StyleSheet } from 'react-native';
import { getColorByTheme } from '../../helpers/utils';

module.exports = StyleSheet.create({
    dropdown: {
        marginVertical: 16,
        height: 50,
        backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 0.9,
        elevation: 2,
        borderWidth: 1,
        borderColor: getColorByTheme('#ececec', '#fff'),
    },
    icon: {
        marginRight: 5,
    },
    itemContainerStyle: {
        backgroundColor: getColorByTheme('#fff', '#000'),
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 14,
        color: getColorByTheme('#000', '#000'),
    },
    placeholderStyle: {
        fontSize: 16,
        color: getColorByTheme('#000', '#fff'),
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});