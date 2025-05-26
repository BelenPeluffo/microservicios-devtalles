import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { config, ORDERS_SERVICE } from 'src/config';

@Module({
  controllers: [OrdersController],
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: config.PRODUCTS_MS_HOST,
          port: config.ORDERS_MS_PORT,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
