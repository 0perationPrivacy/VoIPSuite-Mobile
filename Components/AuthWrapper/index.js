// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import styles from '../../style';

const AuthWrapper = ({ children }) => {
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.authContainer}>
            {children}
            <View style={{ height: 100 }} />
        </KeyboardAvoidingView>

    )
}

export default AuthWrapper;