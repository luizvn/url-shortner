import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { DomainException } from '../../domain/exceptions/domain.exception';

@Catch(DomainException)
export class RpcDomainExceptionFilter
  implements RpcExceptionFilter<DomainException>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  catch(exception: DomainException, host: ArgumentsHost): Observable<any> {
    return throwError(
      () =>
        new RpcException({
          statusCode: 400,
          message: exception.message,
          code: 'DOMAIN_VALIDATION_ERROR',
        })
    );
  }
}
