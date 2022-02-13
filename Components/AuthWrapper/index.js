// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import styles from '../../style';

const AuthWrapper = ({ children }) => {
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.authContainer}>
            {children}
        </KeyboardAvoidingView>

    )
}

export default AuthWrapper;