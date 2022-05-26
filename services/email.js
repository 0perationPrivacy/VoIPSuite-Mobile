
import { API_URL } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const emailService = {
  setEmailCredentials,
  getUserEmailData
};

var prefix = 'email';

function setEmailCredentials(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/create`, requestOptions).then(handleResponse);
}

function getUserEmailData() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  };

  return fetch(`${API_URL}/${prefix}/setting-get`, requestOptions).then(handleResponse);
}