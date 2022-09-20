
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';
import { ApiService } from './Api';

export const profileService = {
  createProfileName,
  getProfileList,
  deleteProfile
};

let prefix = 'profile';

function createProfileName(data) {
  return ApiService.initApi(`${prefix}/create`, 'POST', data);
}

function getProfileList() {
  return ApiService.initApi(`${prefix}/getdata`, 'POST');
}

function deleteProfile(data) {
  return ApiService.initApi(`${prefix}/delete-profile`, 'POST', data);
}