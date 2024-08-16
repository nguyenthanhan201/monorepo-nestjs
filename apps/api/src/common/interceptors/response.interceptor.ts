import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    console.log("👌  statusCode:", statusCode);

    // handle error response
    // if (statusCode >= 400) {
    //   return next.handle().pipe(
    //     map((response) => ({
    //       statusCode: statusCode,
    //       message: response?.message || "Error",
    //       stack: response?.stack || "no stack",
    //     }))
    //   );
    // }

    return next.handle().pipe(
      map((response) => ({
        status: context.switchToHttp().getResponse().statusCode,
        message: response?.message || "Success",
        data: response?.data || response,
      }))
    );
  }
}
