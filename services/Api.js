
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const ApiService = {
  initApi,
};

function initApi(endpoint, method = 'GET', data = {}) {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${endpoint}`, requestOptions).then(handleResponse);
}