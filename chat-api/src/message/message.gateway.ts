import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: any, ...args: any[]) {
    console.log({ id: client.id });
  }
  handleDisconnect(client: any) {
    console.log({ id: client.id });
  }
  
  @WebSocketServer()
  server: Server;

  usernames: string[] = [];

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log({ payload });
    this.server.emit('message', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('user-take')
  handleUserTake(client: Socket, payload: any): void {
    console.log({ payload });

    this.usernames.push(payload);
  }

  @SubscribeMessage('user-check')
  handleUserCheck(client: Socket, payload: any): void {
    client.emit(
      'user-exist',
      this.usernames.some((u) => u === payload),
    );
  }
}
