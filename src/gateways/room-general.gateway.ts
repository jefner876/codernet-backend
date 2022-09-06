import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class RoomGeneralGateway implements OnGatewayDisconnect {

  nicknames: Map<string, string> = new Map();  

  @WebSocketServer()
  server

  handleDisconnect(client: Socket) { 
    this.server.emit('users-changed', {user: this.nicknames[client.id], event: 'left'});
    this.nicknames.delete(client.id);
  }

  @SubscribeMessage('set-nickname') 
  setNickname(client: Socket, nickname: string) {
    this.nicknames[client.id] = nickname;
    this.server.emit('users-changed', {user: nickname, event: 'joined room: General'}); 
  }
  @SubscribeMessage('room-general-message')
  handleMessage(client: Socket , {data}) {    
    this.server.emit("room-general-message", {text: data, from: this.nicknames[client.id], created: new Date() })
  }
}
