import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway()
export class MessagesGateway implements NestGateway {
  constructor(private readonly messagesService: MessagesService) {}
  users = new Map();

  @WebSocketServer()
  server;

  @SubscribeMessage('joinRoom')
  async handleJoin(
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
  async handleMessage(
    @MessageBody() { chatMessage, room, userId },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(room).emit('message:received', chatMessage);
    this.messagesService.create({
      body: chatMessage.text,
      user: userId,
      room,
    });
  }

  handleDisconnect(socket: Socket) {
    this.server.emit('userLeave', {
      user: this.users[socket.id],
      event: 'left',
    });

    this.users.delete(socket.id);
  }
}
