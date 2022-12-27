import { store } from "../redux/store";

var API_URL = 'https://voip.operationprivacy.com/api';
var API_PREFIX = '/api';

export function getServerUrl() {
  const state = store.getState();
  const { user = {} } = state.authentication;

  if (user?.server_url) {
    API_URL = user?.server_url;
  }

  return API_URL;
}
export var DEFAUL_URL = API_URL + API_PREFIX;


export const MESSAGE_CHANNEL_ID = 'socket-message';
export const MESSAGE_CHANNEL_NAME = 'socket-message-channel';