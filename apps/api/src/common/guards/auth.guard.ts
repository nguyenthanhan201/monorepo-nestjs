import { AuthFailureError } from "@app/shared/core/error.response";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorators/allow-unauthorize-request.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly configService: ConfigService // private readonly authService: AuthService,
  ) {}

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get("JWT_SECRET"),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) return true;

    const request = context.switchToHttp().getRequest();
    try {
      const token = this.extractTokenFromHeader(request);
      // console.log("👌  token:", token);

      const payload = await this.verifyToken(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers`
      request["user"] = payload;
    } catch (error) {
      console.log("👌  error:", error);
      if (error.name === "TokenExpiredError") {
        throw new AuthFailureError("EXPIRED_TOKEN");
      } else {
        throw new AuthFailureError("Token not found");
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
    // const token = request.cookies.token;
    // console.log('👌  token:', token);
    // if (!token) return undefined;

    // return coreHelper.removeQuotes(token);
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
