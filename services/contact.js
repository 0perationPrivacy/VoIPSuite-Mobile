
import { API_URL } from '../helpers/config';
import { authHeader, getUserId } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const contactService = {
  createContact,
  getAllContacts
};

var prefix = 'contact';
var user = getUserId();

function createContact(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/create`, requestOptions).then(handleResponse);
}

function getAllContacts() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  };

  return fetch(`${API_URL}/${prefix}/get-all`, requestOptions).then(handleResponse);
}