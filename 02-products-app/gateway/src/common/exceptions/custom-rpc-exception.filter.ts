import {
  ArgumentsHost,
  Catch,
  RpcExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    // return throwError(() => exception.getError());
    console.error(exception.getError());
    throw new UnauthorizedException(exception.getError());
  }
}
