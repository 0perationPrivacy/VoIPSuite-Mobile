import { userConstants } from '../constants';
import { userService } from '../../services';
import { navigate } from '../../helpers/RootNavigation';
import { alertActions } from './alert';
import { showMessage, hideMessage } from "react-native-flash-message";

export const userActions = {
    login,
    logout,
    register,
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    navigate('Home')
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user, errorMessagesCb) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    navigate('Login')
                    showMessage({
                        message: "Registration successful",
                        type: "success",
                    });
                    dispatch(alertActions.success('Registration successful'));
                },
                ([error, valdidationErrors]) => {
                    if (errorMessagesCb) {
                        errorMessagesCb(valdidationErrors)
                    }

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.REGISTER_REQUEST, } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}