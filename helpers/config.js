import { store } from "../redux/store";

var API_URL = 'https://voip.operationprivacy.com/api';
// var API_URL = 'https://devvoip.operationprivacy.com/api';

export function getServerUrl() {
  console.log('agya in server url');

  const state = store.getState();
  const { user = {} } = state.authentication;

  if (user?.server_url) {
    API_URL = user?.server_url;
  }

  return API_URL;
}

export var DEFAUL_URL = API_URL;