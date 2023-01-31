import { emailConstants } from '../constants';
import { emailService } from '../../services';
import { alertActions } from './alert';

export const emailActions = {
  createEmailCredAction,
  getEmailSettingsAction,
  saveProfileEmailSettingsAction
};

function createEmailCredAction(data, errorMessagesCb) {
  return dispatch => {
    dispatch(request());

    emailService.setEmailCredentials(data)
      .then(
        response => {
          dispatch(success());
          dispatch(alertActions.success(response?.message));

          // cb();
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

  function request() { return { type: emailConstants.CREATE_EMAIL_REQUEST, } }
  function success() { return { type: emailConstants.CREATE_EMAIL_SUCCESS } }
  function failure(error) { return { type: emailConstants.CREATE_EMAIL_FAILURE, error } }
}

function getEmailSettingsAction(cb) {
  return dispatch => {
    dispatch(request());

    emailService.getUserEmailData()
      .then(
        response => {
          dispatch(success(response?.data));
          dispatch(alertActions.success(response?.message));

          if (cb) {
            cb()
          }
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: emailConstants.CREATE_EMAIL_REQUEST, } }
  function success(settings) { return { type: emailConstants.GET_EMAIL_SUCCESS, settings } }
  function failure(error) { return { type: emailConstants.CREATE_EMAIL_FAILURE, error } }
}

function saveProfileEmailSettingsAction(data, cb) {
  return dispatch => {
    dispatch(request());

    emailService.saveProfileEmailSettings(data)
      .then(
        response => {
          const { data, message } = response;
          dispatch(success());
          dispatch(alertActions.success(message));

          cb(data);
        },
        ([error, valdidationErrors]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: emailConstants.CREATE_EMAIL_REQUEST, } }
  function success() { return { type: emailConstants.SAVE_EMAIL_SETTINGS_SUCCESS, } }
  function failure(error) { return { type: emailConstants.CREATE_EMAIL_FAILURE, error } }
}
