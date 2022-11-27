import { store } from "../redux/store";

var API_URL = 'https://voip-node.herokuapp.com';
var API_PREFIX = '/api';

// var API_URL = 'https://voip.operationprivacy.com/api';
// var API_URL = 'https://devvoip.operationprivacy.com/api';

export function getServerUrl() {
  const state = store.getState();
  const { user = {} } = state.authentication;

  if (user?.server_url) {
    API_URL = user?.server_url;
  }

  return API_URL + API_PREFIX;
}

export var DEFAUL_URL = API_URL + API_PREFIX;