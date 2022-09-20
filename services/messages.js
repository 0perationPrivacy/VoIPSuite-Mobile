
import { getUserId } from '../helpers/auth-header';
import { ApiService } from './Api';

export const messagesService = {
  getMessageByProfileId,
  deleteMessage,
  viewMessage,
  sendMessageService
};

var prefix = 'setting';
var user = getUserId();

function getMessageByProfileId(setting) {
  return ApiService.initApi(`${prefix}/sms-number-list`, 'POST', { user, setting });
}

function deleteMessage(number) {
  return ApiService.initApi(`${prefix}/message-list-delete`, 'POST', { user, number });
}

function viewMessage(postData) {
  let data = { ...postData, user: user }
  return ApiService.initApi(`${prefix}/message-list`, 'POST', data);
}

function sendMessageService(postData) {
  let data = { ...postData, user: user }
  return ApiService.initApi(`${prefix}/send-sms`, 'POST', data);
}