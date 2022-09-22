
import { ApiService } from './Api';

export const contactService = {
  createContact,
  getAllContacts,
  deleteContact,
  createImportedContact
};

var prefix = 'contact';

function createContact(params, isEditRquest = false) {
  let name = isEditRquest ? 'update' : 'create';
  return ApiService.initApi(`${prefix}/${name}`, 'POST', params);
}

function getAllContacts() {
  return ApiService.initApi(`${prefix}/get-all`);
}

function deleteContact(params) {
  return ApiService.initApi(`${prefix}/delete`, 'POST', params);
}

function createImportedContact(data) {
  return ApiService.initApi(`${prefix}/multiple-add`, 'POST', data);
}
