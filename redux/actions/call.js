import { callConstants } from '../constants';
import { callService } from '../../services';
import { alertActions } from './alert';

export const callActions = {
  getProviderTokenAction,
};

function getProviderTokenAction(data) {
  return dispatch => {
    dispatch(request());

    callService.getProviderToken(data)
      .then(
        response => {
          dispatch(success(response.data));
          // dispatch(alertActions.success(response?.message));
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: callConstants.GET_TOKEN_REQUEST, } }
  function success(data) { return { type: callConstants.GET_TOKEN_SUCCESS, data } }
  function failure(error) { return { type: callConstants.GET_TOKEN_FAILURE, error } }
}