import { messagesConstants } from '../constants';
import { alertActions } from './alert';
import { messagesService } from '../../services';

export const messagesActions = {
  getMessagesByProfileIdAction,
};

function getMessagesByProfileIdAction(profileId) {
  return dispatch => {
    dispatch(request());

    messagesService.getMessageByProfileId(profileId)
      .then(
        data => {
          if (data) {
            dispatch(success(data));
            return;
          }

          dispatch(failure('No Messages Found'));
          dispatch(alertActions.error('No Messages Found'));
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: messagesConstants.GET_MESSAGES_REQUEST, } }
  function success(data) { return { type: messagesConstants.GET_MESSAGES_SUCCESS, data } }
  function failure(error) { return { type: messagesConstants.GET_MESSAGES_FAILURE, error } }
}