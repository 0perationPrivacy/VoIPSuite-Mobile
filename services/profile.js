
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const profileService = {
  createProfileName,
  getProfileList,
  deleteProfile
};

function createProfileName(data) {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/profile/create`, requestOptions).then(handleResponse);
}

function getProfileList() {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  };

  return fetch(`${API_URL}/profile/getdata`, requestOptions).then(handleResponse);
}

function deleteProfile(data) {
  let API_URL = getServerUrl();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/profile/delete-profile`, requestOptions).then(handleResponse);
}