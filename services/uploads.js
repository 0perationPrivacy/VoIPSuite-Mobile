
import { API_URL } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const uploadService = {
  uploadMedia
};

var prefix = 'media';

function uploadMedia(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data; ', ...authHeader() },
    body: data
  };

  console.log('hello',data)

  return fetch(`${API_URL}/${prefix}/upload-files`, requestOptions).then(handleResponse);
}