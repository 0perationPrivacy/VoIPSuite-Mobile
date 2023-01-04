import { store } from "../redux/store";

var BASE_URL = 'https://voip.operationprivacy.com';
var PREFIX = '/api';

export function getBaseUrl() {
  const state = store.getState();
  const { user = {} } = state.authentication;

  if (user?.server_url) {
    BASE_URL = user?.server_url;
  }

  return BASE_URL;
}

export function getServerUrl() {
  let baseUrl = getBaseUrl();
  return baseUrl + PREFIX;
}

export const API_PREFIX = PREFIX;
export const MESSAGE_CHANNEL_ID = 'socket-message';
export const MESSAGE_CHANNEL_NAME = 'socket-message-channel';