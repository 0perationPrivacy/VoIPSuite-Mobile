
import { API_URL } from '../helpers/config';
import { authHeader, getUserId } from '../helpers/auth-header';
import { handleResponse } from './handle';

export const contactService = {
  createContact,
  getAllContacts,
  deleteContact,
  createImportedContact
};

var prefix = 'contact';

function createContact(params, isEditRquest = false) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(params)
  };

  let name = isEditRquest ? 'update' : 'create';

  console.log(name, params)

  return fetch(`${API_URL}/${prefix}/${name}`, requestOptions).then(handleResponse);
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

function createImportedContact(data) {
  console.log(data,'data')
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  };

  return fetch(`${API_URL}/${prefix}/multiple-add`, requestOptions).then(handleResponse);
}
