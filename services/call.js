
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const callService = {
  getProviderToken
};

var prefix = 'call';

function getProviderToken(data) {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/token`, requestOptions).then(handleResponse);
}