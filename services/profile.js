
import { API_URL } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const profileService = {
  createProfileName,
};

function createProfileName(data) {
  console.log(data);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' , ...authHeader()},
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/profile/create`, requestOptions).then(handleResponse);
}

