import Notifications from './init';

class NotificationHandler {
  onNotification(notification) {
    console.log('NotificationHandler:', notification);

    if (typeof this._onNotification === 'function') {
      this._onNotification(notification);
    }
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
}

const handler = new NotificationHandler();

Notifications.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: handler.onNotification.bind(handler),
});

export default handler;
