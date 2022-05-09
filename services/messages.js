
import { API_URL } from '../helpers/config';
import { authHeader, getUserId } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const messagesService = {
  getMessageByProfileId,
};

let prefix = 'setting';

function getMessageByProfileId(setting) {
  let user = getUserId();
  console.log('user id', user, setting, { user, setting })

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ user, setting })
  };

  return fetch(`${API_URL}/${prefix}/sms-number-list`, requestOptions).then(handleResponse);
}