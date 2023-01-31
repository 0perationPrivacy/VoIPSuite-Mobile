
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';
import { store } from '../redux/store';

export const uploadService = {
  uploadMedia
};

var prefix = 'media';

function uploadMedia(data) {
  let API_URL = getServerUrl();
  var state = store.getState();
  
  const { user } = state?.authentication;

  const requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      'token': user?.data?.token
    },
    body: data
  };

  return fetch(`${API_URL}/${prefix}/upload-files`, requestOptions).then(handleResponse);
}