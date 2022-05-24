import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { navigate, navigateAndReset } from '../../helpers/RootNavigation';
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash';
import { profileActions } from '../../redux/actions';

const Splash = () => {
    const _user = useSelector(state => state.authentication);
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            const { loggedIn, user } = _user;
            if (loggedIn && user) {
                getProfileList()
                return
            }
            navigateAndReset('Login')
        }, 2000);
    }, [])

    const getProfileList = () => {
		dispatch(profileActions.getProfileAction(navigateToHome))
	}

    const navigateToHome = () => {
        navigateAndReset('Messages')
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={"large"} color="#3770e4" />
        </View>
    )
}

export default Splash;