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

    websocket.on('connect', this.onConnect);
    websocket.on('disconnect', this.onDisconnect);

    return websocket;
  }

  onConnect = () => {
    console.log('connected to socket =====>');
  };

  onDisconnect = () => {
    console.log('disconnecting =====>');
    this.connect();
  };

  isConnected() {
    return this.socket?.connected;
  }

  joinRoomByUserId(userId) {
    this.socket?.emit('join_profile_channel', userId);
  }

  listenEventForMessage(listener = () => {}) {
    this.socket?.on('user_message', listener);
  }

  disconnect() {
    let io = this.socket;
    if (io) {
      io.disconnect();
      io.removeAllListeners();

      this.socket = null;
    }
  }
}

let socketInstance = new Socket();
export default socketInstance;
