
import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';
import { store } from '../redux/store';
import { ApiService } from './Api';

export const settingsService = {
  getProfileSettings,
  getNumberListByProfile,
  checkProfileSettings,
  createOrOverrideProfile
};

var prefix = 'setting';

function getProfileSettings(data) {
  return ApiService.initApi(`${prefix}/get-setting`, 'POST', data);
}

function getNumberListByProfile(data) {
  return ApiService.initApi(`${prefix}/get-number`, 'POST', data);
}

function checkProfileSettings(data) {
  return ApiService.initApi(`${prefix}/check-setting`, 'POST', data);
}

function createOrOverrideProfile(data) {
  return ApiService.initApi(`${prefix}/create`, 'POST', data);
}