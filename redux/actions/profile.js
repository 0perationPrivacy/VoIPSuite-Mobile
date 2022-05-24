import { profileConstants, userConstants } from '../constants';
import { userService } from '../../services';
import { closeDrawer, navigate, navigateAndReset } from '../../helpers/RootNavigation';
import { alertActions } from './alert';
import { showMessage, hideMessage } from "react-native-flash-message";
import { profileService } from '../../services/profile';

export const profileActions = {
    createProfileAction,
    getProfileAction,
    setProfileName
};

function createProfileAction(data, cb, errorMessagesCb) {
    return dispatch => {
        dispatch(request());

        profileService.createProfileName(data)
            .then(
                response => {
                    dispatch(success());
                    dispatch(alertActions.success(response?.message));

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

    function request() { return { type: profileConstants.CREATE_PROFILE_REQUEST, } }
    function success() { return { type: profileConstants.CREATE_PROFILE_SUCCESS } }
    function failure(error) { return { type: profileConstants.CREATE_PROFILE_FAILURE, error } }
}

function getProfileAction(cb) {
    return dispatch => {
        dispatch(request());

        profileService.getProfileList()
            .then(
                response => {
                    dispatch(success(response.data));
                    if (cb) {
                        cb();
                    }
                    // dispatch(alertActions.success(response?.message));
                },
                ([error]) => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: profileConstants.GET_PROFILE_REQUEST, } }
    function success(data) { return { type: profileConstants.GET_PROFILE_SUCCESS, data } }
    function failure(error) { return { type: profileConstants.GET_PROFILE_FAILURE, error } }
}

function setProfileName(profile) {
    return dispatch => {
        dispatch(request(profile));
    };

    function request(profile) { return { type: profileConstants.SET_PROFILE_NAME, profile } }
}