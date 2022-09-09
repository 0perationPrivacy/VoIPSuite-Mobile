import { userConstants } from '../constants';
import { userService } from '../../services';
import { closeDrawer, navigate, navigateAndReset } from '../../helpers/RootNavigation';
import { alertActions } from './alert';
import { showMessage, hideMessage } from "react-native-flash-message";

export const userActions = {
    login,
    logout,
    register,
    changeUsernameAction,
    changePasswordAction
};

function login(data, errorMessagesCb) {
    let { server_url = null } = data;

    return dispatch => {
        dispatch(request());

        userService.login(data)
            .then(
                user => {
                    Object.assign(user, { server_url })

                    dispatch(success(user));
                    showMessage({
                        message: user?.message,
                        type: "success",
                    });
                    navigateAndReset('Splash')
                },
                ([error, valdidationErrors]) => {

                    if (errorMessagesCb) {
                        errorMessagesCb(valdidationErrors)
                    }

                    showMessage({
                        message: error.toString(),
                        type: "danger",
                    });

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.LOGIN_REQUEST } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    return dispatch => {
        dispatch(logout());
        navigateAndReset('Login');
        closeDrawer()
    };

    function logout() { return { type: userConstants.LOGOUT } }
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

function changeUsernameAction(user, cb, errorMessagesCb) {
    return dispatch => {
        dispatch(request());

        userService.changeUsername(user)
            .then(
                response => {
                    dispatch(success(response.data));
                    showMessage({
                        message: response.message,
                        type: "success",
                    });
                    dispatch(alertActions.success(response.message));

                    cb();
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

    function request() { return { type: userConstants.LOGIN_REQUEST, } }
    function success(user) { return { type: userConstants.NAME_CHANGE_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function changePasswordAction(user, errorMessagesCb) {
    return dispatch => {
        dispatch(request());

        userService.changePassword(user)
            .then(
                response => {
                    dispatch(success(response.data));
                    showMessage({
                        message: response.message,
                        type: "success",
                    });
                    dispatch(alertActions.success(response.message));
                },
                ([error, valdidationErrors]) => {
                    if (errorMessagesCb) {
                        errorMessagesCb(valdidationErrors)
                    }

                    showMessage({
                        message: error.toString(),
                        type: "danger",
                    });

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.LOGIN_REQUEST, } }
    function success(user) { return { type: userConstants.NAME_CHANGE_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}