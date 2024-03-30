import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

type ThrottlerExceptionCustom = {
  response: string;
  status: number;
  message: string;
  name: string;
};

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerExceptionCustom, host: ArgumentsHost) {
    const { message, status: statusCode } = exception;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof ThrottlerException
        ? HttpStatus.TOO_MANY_REQUESTS
        : statusCode;

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: message,
    });
  }
}
