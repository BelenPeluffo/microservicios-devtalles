import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { CustomRpcExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new CustomRpcExceptionFilter());
  await app.listen(config.PORT ?? 3000);
  logger.log(`Gateway is running on port ${config.PORT}`);
}
bootstrap();
