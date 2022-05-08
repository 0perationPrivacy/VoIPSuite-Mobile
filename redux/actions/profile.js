import { profileConstants, userConstants } from '../constants';
import { userService } from '../../services';
import { closeDrawer, navigate, navigateAndReset } from '../../helpers/RootNavigation';
import { alertActions } from './alert';
import { showMessage, hideMessage } from "react-native-flash-message";
import { profileService } from '../../services/profile';

export const profileActions = {
    createProfileAction,
};

function createProfileAction(user, errorMessagesCb) {
    return dispatch => {
        dispatch(request());

        profileService.createProfileName(user)
            .then(
                user => {
                    dispatch(success());
                    // showMessage({
                    //     message: "Registration successful",
                    //     type: "success",
                    // });
                    // dispatch(alertActions.success('Registration successful'));
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