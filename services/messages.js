
import { API_URL } from '../helpers/config';
import { authHeader, getUserId } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const messagesService = {
  getMessageByProfileId,
  deleteMessage,
  viewMessage
};

var prefix = 'setting';
var user = getUserId();

function getMessageByProfileId(setting) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ user, setting })
  };

  return fetch(`${API_URL}/${prefix}/sms-number-list`, requestOptions).then(handleResponse);
}

function deleteMessage(number) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ user, number })
  };

  return fetch(`${API_URL}/${prefix}/message-list-delete`, requestOptions).then(handleResponse);
}

function viewMessage(postData) {
  let data = { ...postData, user: user }
  console.log(data);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/message-list`, requestOptions).then(handleResponse);
}