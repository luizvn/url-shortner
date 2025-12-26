import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                },
              }
            : undefined,
      },
    }),
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [],
})
export class AppModule {}
