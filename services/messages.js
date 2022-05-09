
import { API_URL } from '../helpers/config';
import { authHeader, getUserId } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const messagesService = {
  getMessageByProfileId,
  deleteMessage
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

function deleteMessage(number) {
  let user = getUserId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ user, number })
  };

  return fetch(`${API_URL}/${prefix}/message-list-delete`, requestOptions).then(handleResponse);
}