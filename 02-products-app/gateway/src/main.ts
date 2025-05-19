import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(config.PORT ?? 3000);
  logger.log(`Gateway is running on port ${config.PORT}`);
}
bootstrap();
