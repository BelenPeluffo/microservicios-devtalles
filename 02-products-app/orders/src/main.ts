import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/envs';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Orders');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: config.PORT,
      },
    },
  );
  await app.listen();
  logger.log(`Orders service is running on port ${config.PORT}`);
}
bootstrap();
