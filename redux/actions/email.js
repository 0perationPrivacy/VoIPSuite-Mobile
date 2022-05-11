import { emailConstants } from '../constants';
import { emailService } from '../../services';
import { alertActions } from './alert';

export const emailActions = {
  createEmailCredAction,
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