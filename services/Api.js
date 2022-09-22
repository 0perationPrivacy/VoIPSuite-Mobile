import { getServerUrl } from '../helpers/config';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from './handle';
import _ from 'lodash';

export const ApiService = {
  initApi,
};

function initApi(endpoint, method = 'GET', data = {}) {
  let API_URL = getServerUrl();
  const requestOptions = {
    method: method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  };

  if (!_.isEmpty(data)) {
    Object.assign(requestOptions, { body: JSON.stringify(data) })
  }

  console.log(`${API_URL}/${endpoint}`, requestOptions)

  return fetch(`${API_URL}/${endpoint}`, requestOptions).then(handleResponse);
}