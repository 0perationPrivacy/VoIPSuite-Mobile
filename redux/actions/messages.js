import {messagesConstants} from '../constants';
import {alertActions} from './alert';
import {messagesService} from '../../services';

export const messagesActions = {
  getMessagesByProfileIdAction,
  deleteMessageAction,
  getMessageDetailsAction,
  sendMessageDetailsAction,
};

function getMessagesByProfileIdAction(profileId, successCb) {
  return dispatch => {
    dispatch(request());

    messagesService.getMessageByProfileId(profileId).then(
      data => {
        if (data) {
          dispatch(success(data));
          return;
        }

        if (successCb) {
          successCb();
        }

        dispatch(failure('No Messages Found'));
        dispatch(alertActions.error('No Messages Found'));
      },
      ([error]) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      },
    );
  };

  function request() {
    return {type: messagesConstants.GET_MESSAGES_REQUEST};
  }
  function success(data) {
    return {type: messagesConstants.GET_MESSAGES_SUCCESS, data};
  }
  function failure(error) {
    return {type: messagesConstants.GET_MESSAGES_FAILURE, error};
  }
}

function deleteMessageAction(number, cb) {
  return dispatch => {
    dispatch(request());

    messagesService.deleteMessage(number).then(
      response => {
        dispatch(success());
        dispatch(alertActions.success('Message has been deleted'));

        if (cb) {
          cb();
        }
      },
      ([error]) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      },
    );
  };

  function request() {
    return {type: messagesConstants.DELETE_MESSAGES_REQUEST};
  }
  function success() {
    return {type: messagesConstants.DELETE_MESSAGES_SUCCESS};
  }
  function failure(error) {
    return {type: messagesConstants.DELETE_MESSAGES_FAILURE, error};
  }
}

function getMessageDetailsAction(data) {
  return dispatch => {
    dispatch(request());

    messagesService.viewMessage(data).then(
      response => {
        if (response) {
          dispatch(success(response));
          return;
        }

        dispatch(failure('No Messages Found'));
        dispatch(alertActions.error('No Messages Found'));
      },
      ([error]) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      },
    );
  };

  function request() {
    return {type: messagesConstants.VIEW_MESSAGES_REQUEST};
  }
  function success(messages) {
    return {type: messagesConstants.VIEW_MESSAGES_SUCCESS, messages};
  }
  function failure(error) {
    return {type: messagesConstants.VIEW_MESSAGES_FAILURE, error};
  }
}

function sendMessageDetailsAction(data, cb, isSuccessMessage = true) {
  return dispatch => {
    dispatch(request());

    messagesService.sendMessageService(data).then(
      response => {
        dispatch(success());

        if (isSuccessMessage) {
          dispatch(alertActions.success(response.message));
        }

        if (cb) {
          cb();
        }
      },
      ([error]) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      },
    );
  };

  function request() {
    return {type: messagesConstants.SEND_MESSAGES_REQUEST};
  }
  function success() {
    return {type: messagesConstants.SEND_MESSAGES_SUCCESS};
  }
  function failure(error) {
    return {type: messagesConstants.SEND_MESSAGES_FAILURE, error};
  }
}
