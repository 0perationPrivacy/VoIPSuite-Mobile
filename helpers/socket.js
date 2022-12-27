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
    let io = this.socket;
    console.log(io)
    if (io) {
      io.disconnect();
      io.removeAllListeners();
    }
  }

  isConnected() {
    return this.socket?.connected;
  }

  onConnectEvent() {
    this.socket?.on("connect", () => {
      console.log('socket connected from headless');
    });
  }

  joinRoomByUserId(userId) {
    this.socket?.emit("join_profile_channel", userId);
  }

  listenEventForMessage(listener = () => { }) {
    this.socket?.on("user_message", listener);
  }
}

let socketInstance = new Socket();
export default socketInstance;