import {NativeModules, DeviceEventEmitter} from 'react-native';

let RNPushNotification = NativeModules.Heartbeat;
let notifHandlers = new Map();

var NOTIF_TAP_EVENT = 'notificationTapEvent';

class NotificationsHelper {
  constructor() {}
  displayNotification(details) {
    RNPushNotification.displayNotification(details);
  }
  addEventListener(type, handler) {
    let listener;

    if (type === 'notification') {
      listener = DeviceEventEmitter.addListener(
        NOTIF_TAP_EVENT,
        function (notifData) {
          console.log(notifData?.dataJSON);
          if (notifData?.dataJSON) {
            const json = JSON.parse(notifData.dataJSON);
            handler(json);
          }
        },
      );
    }
    notifHandlers.set(type, listener);
  }
  removeEventListener(type, handler) {
    let listener = notifHandlers.get(type);
    if (!listener) {
      return;
    }
    listener.remove();
    notifHandlers.delete(type);
  }
}

export default new NotificationsHelper();
