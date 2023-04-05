import NotificationHandler from './handler';

export default class NotificationService {
  constructor(onNotification) {
    NotificationHandler.attachNotification(onNotification);
  }
}
