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
        // jsonp: false,
        transports: ['websocket'],
      }))
    });
    // return this.socket.connect()
  }

  disconnect() {
    this.socket.disconnect()
  }

  isConnected() {
    return this.socket;
  }
}

let __socket = new Socket();
export default __socket;