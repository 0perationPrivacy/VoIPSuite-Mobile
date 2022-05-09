import { messagesConstants } from '../constants';
import { alertActions } from './alert';
import { messagesService } from '../../services';

export const messagesActions = {
  getMessagesByProfileIdAction,
  deleteMessageAction
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

function deleteMessageAction(number, cb) {
  return dispatch => {
    dispatch(request());

    messagesService.deleteMessage(number)
      .then(
        response => {
          console.log(response)
          dispatch(success('Message has been deleted'));
          dispatch(alertActions.success('Message has been deleted'));

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

  function request() { return { type: messagesConstants.DELETE_MESSAGES_REQUEST, } }
  function success() { return { type: messagesConstants.DELETE_MESSAGES_SUCCESS, } }
  function failure(error) { return { type: messagesConstants.DELETE_MESSAGES_FAILURE, error } }
}