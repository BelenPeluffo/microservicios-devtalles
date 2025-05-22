import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Orders');
  const app = await NestFactory.create(AppModule);
  await app.listen(config.PORT);
  logger.log(`Orders service is running on port ${config.PORT}`);
}
bootstrap();
