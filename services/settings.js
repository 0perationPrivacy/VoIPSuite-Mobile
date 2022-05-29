
import { API_URL } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const settingsService = {
  getProfileSettings,
  getNumberListByProfile
};

var prefix = 'setting';

function getProfileSettings(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/get-setting`, requestOptions).then(handleResponse);
}

function getNumberListByProfile(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/get-number`, requestOptions).then(handleResponse);
}