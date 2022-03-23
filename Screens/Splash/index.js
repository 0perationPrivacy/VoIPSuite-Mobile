import React, { useEffect, useState } from 'react'
import { View, KeyboardAvoidingView, StatusBar } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
import styles from '../authCss';
const logo = require('../../assets/logo-b.svg')
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'
import _ from 'lodash';
import { isEmpty } from '../../helpers/utils';

const Splash = (props) => {
    const user = useSelector(state => state.authentication.user);

    useEffect(() => {
        console.log(user)
    }, [])

    return (
        <View></View>
    )
}

export default Splash;