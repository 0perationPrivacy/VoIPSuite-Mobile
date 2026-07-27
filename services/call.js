import {ApiService} from './Api';

export const callService = {
  getSipCredentials,
  getCallHistory,
};

var prefix = 'call';

function getSipCredentials(setting_id) {
  return ApiService.initApi(`${prefix}/sip-credentials`, 'POST', {setting_id});
}

function getCallHistory(setting_id) {
  return ApiService.initApi(`${prefix}/history`, 'POST', {setting_id});
}
