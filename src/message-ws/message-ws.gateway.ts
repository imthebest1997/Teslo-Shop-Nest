import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({
  cors: true,
})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect(true);
      return;     
    }

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client);
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite solo al cliente que envio el mensaje
    // client.emit('message-from-server', {
    //   fullName: "Chito",
    //   message: payload.message || "Hello from server" 
    // });

    //! Emitir a todos menos, el cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: "Chito",
    //   message: payload.message || "Hello from server" 
    // }); 

    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || "Hello from server"
    });

    // this.messageWsService.sendMessageToClient(payload);
  }

}
