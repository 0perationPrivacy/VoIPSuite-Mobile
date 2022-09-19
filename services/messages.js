
import { getServerUrl } from '../helpers/config';
import { authHeader, getUserId } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const messagesService = {
  getMessageByProfileId,
  deleteMessage,
  viewMessage,
  sendMessageService
};

var prefix = 'setting';
var user = getUserId();

function getMessageByProfileId(setting) {
  let API_URL = getServerUrl();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ user, setting })
  };

  return fetch(`${API_URL}/${prefix}/sms-number-list`, requestOptions).then(handleResponse);
}

function deleteMessage(number) {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ user, number })
  };

  return fetch(`${API_URL}/${prefix}/message-list-delete`, requestOptions).then(handleResponse);
}

function viewMessage(postData) {
  let API_URL = getServerUrl();
  let data = { ...postData, user: user }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/message-list`, requestOptions).then(handleResponse);
}

function sendMessageService(postData) {
  let API_URL = getServerUrl();
  let data = { ...postData, user: user }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/send-sms`, requestOptions).then(handleResponse);
}