import { store } from "../redux/store";

var API_URL = 'http://voip-node.herokuapp.com/api';

const state = store.getState();
export function getServerUrl() {
  const { user = {} } = state.authentication;

  if (user?.server_url) {
    API_URL = user?.server_url;
  }
  console.log(API_URL, '<<< API_URL')
  return API_URL;
}

// export const API_URL = 'http://localhost:3000/api';