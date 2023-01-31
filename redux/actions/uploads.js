import { uploadConstants } from '../constants';
import { uploadService } from '../../services';
import { alertActions } from './alert';

export const uploadsActions = {
  uploadMediaAction,
};

function uploadMediaAction(formData, cb) {
  return dispatch => {
    dispatch(request());

    uploadService.uploadMedia(formData)
      .then(
        response => {
          dispatch(success());
          cb(response.data)
          // dispatch(alertActions.success(response?.message));
        },
        ([error]) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: uploadConstants.CREATE_UPLOAD_REQUEST, } }
  function success() { return { type: uploadConstants.CREATE_UPLOAD_SUCCESS } }
  function failure(error) { return { type: uploadConstants.CREATE_UPLOAD_FAILURE, error } }
}