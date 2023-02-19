import SocketIO from 'socket.io-client';
import {getBaseUrl} from './config';
class Socket {
  constructor() {
    this.socket = null;
  }

  init() {
    this.socket = this.connect();
    return this.socket;
  }

  connect() {
    let url = getBaseUrl();
    const websocket = SocketIO(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 10000,
    });

    websocket.on('connect', () => {
      console.log('socket connected from headless');
    });

    websocket.on('disconnect', () => {
      console.log('socket disconnected from headless');
    });

    return websocket;
  }

  disconnect() {
    let io = this.socket;
    if (io) {
      io.disconnect();
      io.removeAllListeners();

      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.connected;
  }

  onConnectEvent() {
    this.socket?.on('connect', () => {
      console.log('socket connected from headless');
    });
  }

  joinRoomByUserId(userId) {
    this.socket?.emit('join_profile_channel', userId);
  }

  listenEventForMessage(listener = () => {}) {
    this.socket?.on('user_message', listener);
  }
}

let socketInstance = new Socket();
export default socketInstance;
