import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { RpcDomainExceptionFilter } from './presentation/filters/rpc-domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
      bufferLogs: true,
    }
  );

  app.useLogger(app.get(Logger));
  const logger = app.get(Logger);

  app.useGlobalFilters(new RpcDomainExceptionFilter());

  await app.listen();
  logger.log(`Microservice is running on port 3001`);
}

bootstrap();
