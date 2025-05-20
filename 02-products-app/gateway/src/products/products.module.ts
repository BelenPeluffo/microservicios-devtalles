import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTS_SERVICE, config } from '../config';

@Module({
  controllers: [ProductsController],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: config.PRODUCTS_MS_HOST,
          port: config.PRODUCTS_MS_PORT,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
