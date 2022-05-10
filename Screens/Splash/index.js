import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { navigate, navigateAndReset } from '../../helpers/RootNavigation';
import { useSelector } from 'react-redux'
import _ from 'lodash';

const Splash = () => {
    const _user = useSelector(state => state.authentication);

    useEffect(() => {
        setTimeout(() => {
            const { loggedIn, user } = _user;
            if (loggedIn && user) {
                navigateAndReset('Messages');
                return
            }
            navigateAndReset('Login')
        }, 2000);
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={"large"} color="#3770e4" />
        </View>
    )
}

export default Splash;