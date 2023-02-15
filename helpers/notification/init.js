/**
 * @providesModule Notifications
 */

'use strict';

import {AppState} from 'react-native';
import notificationComponent from './helper';

const Notifications = {
  handler: notificationComponent,
  onNotification: false,
  isLoaded: false,
};

Notifications.callNative = function (name, params) {
  if (typeof this.handler[name] === 'function') {
    if (Array.isArray(params) && typeof params !== 'object') {
      params = [];
    }

    return this.handler[name](...params);
  } else {
    return null;
  }
};

/**
 * Configure local and remote notifications
 * @param {Object}    options
 * @param {function}  options.onNotification - Fired when a remote notification is received.
 */

Notifications.configure = function (options) {
  if (typeof options.onNotification !== 'undefined') {
    this.onNotification = options.onNotification;
  }

  if (this.isLoaded === false) {
    this._onNotification = this._onNotification.bind(this);
    this.callNative('addEventListener', ['notification', this._onNotification]);

    this.isLoaded = true;
  }
};

Notifications._onNotification = function (data, initialNotification = false) {
  if (this.onNotification !== false) {
    let notification = data;

    this.onNotification(notification);
  }
};

/* Unregister */
Notifications.unregister = function () {
  this.callNative('removeEventListener', [
    'notification',
    this._onNotification,
  ]);

  this.isLoaded = false;
};

// https://developer.android.com/reference/android/app/NotificationManager#IMPORTANCE_DEFAULT
Notifications.Importance = Object.freeze({
  DEFAULT: 3,
  HIGH: 4,
  LOW: 2,
  MIN: 1,
  NONE: 0,
  UNSPECIFIED: -1000,
});

export default Notifications;
