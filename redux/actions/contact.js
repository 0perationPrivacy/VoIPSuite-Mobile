import { contactConstants } from '../constants';
import { contactService } from '../../services';
import { alertActions } from './alert';

export const contactActions = {
  createContactAction,
  getAllContactsAction,
  deleteContactAction
};

function createContactAction(data, cb, errorMessagesCb) {
  return dispatch => {
    dispatch(request());

    contactService.createContact(data)
      .then(
        response => {
          dispatch(success());
          dispatch(alertActions.success(response?.message));

          if (cb) {
            cb()
          }

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

  function request() { return { type: contactConstants.CREATE_CONTACT_REQUEST, } }
  function success() { return { type: contactConstants.CREATE_CONTACT_SUCCESS } }
  function failure(error) { return { type: contactConstants.CREATE_CONTACT_FAILURE, error } }
}

function getAllContactsAction() {
  return dispatch => {
    dispatch(request());

    contactService.getAllContacts()
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

  function request() { return { type: contactConstants.GET_CONTACT_REQUEST, } }
  function success(data) { return { type: contactConstants.GET_CONTACT_SUCCESS, data } }
  function failure(error) { return { type: contactConstants.GET_CONTACT_FAILURE, error } }
}

function deleteContactAction(params, cb) {
  return dispatch => {
    dispatch(request());

    contactService.deleteContact(params)
      .then(
        response => {
          dispatch(success());
          dispatch(alertActions.success(response?.message));

          if (cb) {
            cb()
          }
        },
        ([error, valdidationErrors]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: contactConstants.DELETE_CONTACT_REQUEST, } }
  function success() { return { type: contactConstants.DELETE_CONTACT_SUCCESS, } }
  function failure(error) { return { type: contactConstants.DELETE_CONTACT_FAILURE, error } }
}