import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class RoomGeneralGateway implements OnGatewayDisconnect {
  users = new Map();

  @WebSocketServer()
  server;

  @SubscribeMessage('joinRoom')
  handleJoin(
    @MessageBody() { username, room, userId },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = { socketId: socket.id, username, room };
    this.users[userId] = user;

    socket.join(user.room);

    this.server.emit('welcomeMessage', 'Welcome to this chat-room');
    socket.broadcast
      .to(user.room)
      .emit('userJoin', `${user.username} has joined the ${user.room} chat`);
  }
  @SubscribeMessage('chatMessage')
  handleMessage(
    @MessageBody() { chatMessage, username, room, userId },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(room).emit('message:received', chatMessage);
  }

  handleDisconnect(socket: Socket) {
    this.server.emit('userLeave', {
      user: this.users[socket.id],
      event: 'left',
    });
    console.log(socket.id);
    this.users.delete(socket.id);
    console.log({ after: this.users });
  }
}
