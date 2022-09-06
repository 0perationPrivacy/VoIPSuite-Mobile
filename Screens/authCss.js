'use strict';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Metrics from '../helpers/Metrics';
import { getColorByTheme } from '../helpers/utils';

module.exports = StyleSheet.create({
    ImageDimension: {
        width: 100,
        height: 100,
    },
    inputContainer: {
        width: '100%',
        marginVertical: 15,
    },
    authContainerCard: {
        backgroundColor: getColorByTheme('#fff', '#121212'),
        width: '100%',
        paddingHorizontal: Metrics.ratio(10),
        paddingVertical: Metrics.ratio(20),
        // shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 4,
        // shadow
        borderRadius: 10
    },
    button: {
        width: '100%',
        marginTop: 5,
    },
    createAccountWrap: {
        marginTop: Metrics.baseMargin,
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    createAccountText: {
        color: '#0d6efd',
        fontSize: 16,
        marginLeft: 5,
    },
    signInButton: {
        backgroundColor: '#198754',
        borderRadius: 10
    },
    socialLinksWrap: {
        flexDirection: 'row',
        marginTop: Metrics.ratio(25),
        justifyContent: 'center'
    },
    socialLinksItem: {
        marginHorizontal: Metrics.ratio(10)
    }
});