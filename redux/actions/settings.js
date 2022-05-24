import { settingsConstants } from '../constants';
import { settingsService } from '../../services';
import { alertActions } from './alert';

export const settingsActions = {
  getProfileSettings,
};

function getProfileSettings(data) {
  return dispatch => {
    dispatch(request());

    settingsService.getProfileSettings(data)
      .then(
        response => {
          dispatch(success(response.data));
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: settingsConstants.GET_PROFILE_SETTINGS_REQUEST, } }
  function success(data) { return { type: settingsConstants.GET_PROFILE_SETTINGS_SUCCESS, data } }
  function failure(error) { return { type: settingsConstants.GET_PROFILE_SETTINGS_FAILURE, error } }
}