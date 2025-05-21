import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class CustomRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const error = exception.getError();
    console.log(error);
    if (typeof error === 'object' && 'status' in error && 'message' in error) {
      response.status(error.status).json({
        statusCode: error.status,
        message: error.message,
      });
    }
    response.status(400).json({
      statusCode: 401,
      message: error,
    });
  }
}
