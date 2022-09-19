
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';
import { store } from '../redux/store';

export const settingsService = {
  getProfileSettings,
  getNumberListByProfile,
  checkProfileSettings,
  createOrOverrideProfile
};

var prefix = 'setting';

function getProfileSettings(data) {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/get-setting`, requestOptions).then(handleResponse);
}

function getNumberListByProfile(data) {
  let API_URL = getServerUrl();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/get-number`, requestOptions).then(handleResponse);
}

function checkProfileSettings(data) {
  let API_URL = getServerUrl();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/check-setting`, requestOptions).then(handleResponse);
}

function createOrOverrideProfile(data) {
  let API_URL = getServerUrl();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/create`, requestOptions).then(handleResponse);
}