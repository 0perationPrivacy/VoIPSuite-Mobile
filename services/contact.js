
import { API_URL } from '../helpers/config';
import { authHeader, getUserId } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const contactService = {
  createContact,
  getAllContacts,
  deleteContact
};

var prefix = 'contact';

function createContact(params) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(params)
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

function deleteContact(params) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(params)
  };

  return fetch(`${API_URL}/${prefix}/delete`, requestOptions).then(handleResponse);
}