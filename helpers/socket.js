import SocketIO from "socket.io-client";
class Socket {
  constructor() {
    this.socket = null;
  }

  async init() {
    this.socket = await this.connect();
    return this.socket;
  }

  async connect() {
    return new Promise((resolve) => {
      resolve(SocketIO("https://voip.operationprivacy.com", {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 100,
        reconnectionAttempts: 10000,
      }))
    });
  }

  disconnect() {
    this.socket.disconnect()
  }

  isConnected() {
    return this.socket?.connected;
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }

  async joinRoomByUserId(userId) {
    io.emit("join_profile_channel", '621e9f2685a90200160c3160');
  }
}

let __socket = new Socket();
export default __socket;