
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const uploadService = {
  uploadMedia
};

var prefix = 'media';

function uploadMedia(data) {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data; ', Accept: "application/json", ...authHeader() },
    body: data
  };

  return fetch(`${API_URL}/${prefix}/upload-files`, requestOptions).then(handleResponse);
}