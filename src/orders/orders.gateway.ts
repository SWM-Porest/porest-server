import { OnModuleInit } from '@nestjs/common';
import { OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

const MSG = {
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_CANCELED: 'ORDER_CANCELED',
};
@WebSocketGateway({
  namespace: 'orders',
  cors: {
    origin: process.env.SOCKET_ORIGIN,
  },
})
export class OrdersGateway implements OnModuleInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // console.log(socket.id);
      // console.log('Connected');
    });
  }

  notifyOrderInfo(order: any) {
    const { restaurant_id } = order;

    if (!!restaurant_id) {
      this.server.emit(restaurant_id, {
        msg: MSG.ORDER_CREATED,
        content: order,
      });
    }
  }

  handleDisconnect(client: any) {
    // console.log('Client disconnected: ', client.id);
  }
}
