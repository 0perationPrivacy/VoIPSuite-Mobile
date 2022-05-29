import { settingsConstants } from '../constants';
import { settingsService } from '../../services';
import { alertActions } from './alert';

export const settingsActions = {
  getProfileSettings,
  getNumbersListByProfileAction,
  checkProfileSettingsAction,
  createProfileSettingsAction
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

function getNumbersListByProfileAction(data, type) {
  return dispatch => {
    dispatch(request());

    settingsService.getNumberListByProfile(data)
      .then(
        response => {
          const { data } = response;
          console.log('lorarr ================>', data, type)
          if (type === 'telnyx') {
            dispatch(success(data.data));
          } else {
            dispatch(success(data));
          }

          dispatch(alertActions.success(response.message));
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: settingsConstants.GET_PROFILE_NUMBERS_REQUEST, } }
  function success(numbers) { return { type: settingsConstants.GET_PROFILE_NUMBERS_SUCCESS, numbers } }
  function failure(error) { return { type: settingsConstants.GET_PROFILE_NUMBERS_FAILURE, error } }
}

function checkProfileSettingsAction(data, cb) {
  return dispatch => {
    dispatch(request());

    settingsService.checkProfileSettings(data)
      .then(
        response => {
          dispatch(success(response.data));
          dispatch(alertActions.success(response.message));

          if (cb) {
            cb();
          }
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: settingsConstants.CHECK_PROFILE_SETTINGS_REQUEST, } }
  function success(numbers) { return { type: settingsConstants.CHECK_PROFILE_SETTINGS_SUCCESS, numbers } }
  function failure(error) { return { type: settingsConstants.CHECK_PROFILE_SETTINGS_FAILURE, error } }
}

function createProfileSettingsAction(data, cb) {
  return dispatch => {
    dispatch(request());

    settingsService.createOrOverrideProfile(data)
      .then(
        response => {
          dispatch(success(response.data));
          dispatch(alertActions.success(response.message));

          if (cb) {
            cb();
          }
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: settingsConstants.CHECK_PROFILE_SETTINGS_REQUEST, } }
  function success(numbers) { return { type: settingsConstants.CHECK_PROFILE_SETTINGS_SUCCESS, numbers } }
  function failure(error) { return { type: settingsConstants.CHECK_PROFILE_SETTINGS_FAILURE, error } }
}