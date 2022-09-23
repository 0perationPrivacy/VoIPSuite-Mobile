
import { ApiService } from './Api';

export const emailService = {
  setEmailCredentials,
  getUserEmailData,
  saveProfileEmailSettings
};

var prefix = 'email';

function setEmailCredentials(data) {
  return ApiService.initApi(`${prefix}/create`, 'POST', data);
}

function getUserEmailData() {
  return ApiService.initApi(`${prefix}/setting-get`, 'GET');
}

function saveProfileEmailSettings(data) {
  return ApiService.initApi(`${prefix}/save/setting`, 'POST', data);
}