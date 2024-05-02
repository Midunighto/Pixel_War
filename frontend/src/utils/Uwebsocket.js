/* import { io, Socket } from "socket.io-client";

export class UWebSocket {
  static socket = null;

  static sendMessage(event, message) {
    if (!UWebSocket.socket) {
      UWebSocket._createSocket();
    }
    console.log(UWebSocket.socket);
    UWebSocket.socket.emit(event, message);
  }

  static subscribe(event, callback) {
    if (!UWebSocket.socket) {
      UWebSocket._createSocket();
    }

    UWebSocket.socket.on(event, (data) => {
      callback(JSON.parse(data));
    });
  }

  /**
   * ceci est privé
   */
/*   static _createSocket() {
    this.socket = io(`${import.meta.env.VITE_SOCKET_BACKEND_URL}`, {
      extraHeaders: {},
    });
  }
} */
 */