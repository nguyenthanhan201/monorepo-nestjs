import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    let message: any =
      exception instanceof HttpException ? exception.message : 'INTERNAL_SERVER_ERROR'
    const name = exception instanceof HttpException ? exception.name : 'INTERNAL_SERVER_ERROR'
    if (message === 'INTERNAL_SERVER_ERROR' && (exception as any).message) {
      message = (exception as any).message
    } else if (message.message) {
      message = message.message
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      name: name,
    })
  }
}

// @Catch()
// export class AllExceptionsFilter extends BaseExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     super.catch(exception, host);
//   }
// }
