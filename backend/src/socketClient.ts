import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket | null = null;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  connect() {
    this.socket = io('https://staging-api.launchpad.com', {
      auth: {
        token: this.token,
      },
    });
    this.socket.on('connect', () => {
      console.log('connected to socket');
    });
  }

  startChat(daoAddress: string, walletAddress: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('startChat', daoAddress, walletAddress);
  }

  sendMessage(params: {
    daoAddress: string;
    content: string;
    walletAddress: string;
    parentId?: string;
  }) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('sendMessage', params);
  }

  endChat(daoAddress: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('endChat', daoAddress);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default SocketClient;
