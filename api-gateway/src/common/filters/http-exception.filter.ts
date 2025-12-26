import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';

    if (exception && typeof exception === 'object' && 'response' in exception) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rpcError = (exception as any).response;

      if (rpcError?.statusCode) {
        status = rpcError.statusCode;
        message = rpcError.message;
        code = rpcError.code || 'RPC_ERROR';
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message = (res as any).message || exception.message;
    }

    this.logger.error(`Error on ${request.url}: ${message}`, exception);
    
    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      code,
    });
  }
}
