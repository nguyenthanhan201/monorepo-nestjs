import { AuthFailureError, ServerError } from "@app/shared/core/error.response";
import { FirebaseService } from "@app/shared/services/firebase.service";
import { supabaseService } from "@app/shared/services/supabase.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { Cache } from "cache-manager";
import {
  JWT_ACCESS_TOKEN_EXPIRED,
  JWT_REFRESH_TOKEN_EXPIRED,
} from "../common/constants";
import { EmailService } from "../modules/email/email.service";
import { User } from "../modules/user/user.model";
import { UserService } from "../modules/user/user.service";
import { AuthLoginDto } from "./dto/authLogin.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    @Inject("main_queue") private readonly authClient: ClientProxy,
    private readonly firebaseService: FirebaseService
  ) {}

  async sendMail() {
    return this.emailService.sendMail("fxannguyen201@gmail.com");
  }

  async getUserByEmail(email: string) {
    return this.userService.getUserByEmail(email);
  }

  async signIn({ providerToken, providerType }: AuthLoginDto) {
    let authUser: { email: string; name: string };

    switch (providerType) {
      case "firebase":
        const { email, name } = await this.firebaseService
          .auth()
          .verifyIdToken(providerToken)
          .then((decodedToken) => decodedToken)
          .catch((error) => {
            console.log("👌  error:", error);
            throw new AuthFailureError("Token invalid");
          });

        authUser = {
          email,
          name,
        };
        break;
      case "supabase":
        const {
          data: { user },
        } = await supabaseService.auth.getUser(providerToken);

        authUser = {
          email: user.email,
          name: "test",
        };
        break;
      default:
        throw new AuthFailureError("Provider not found");
    }

    const { email, name } = authUser;

    let user = await this.userService.findOne(email);
    // console.log('👌  user:', user);

    if (!user) {
      user = await this.userService
        .create({
          email,
          name,
        })
        .then((res) => {
          return res;
        });
    }

    const payload = { ...user, refeshToken: "" };

    const access_token = await this.generateToken(
      payload,
      JWT_ACCESS_TOKEN_EXPIRED
    );
    const refresh_token = await this.generateToken(
      payload,
      JWT_REFRESH_TOKEN_EXPIRED
    );

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async generateToken(user: User, expiresIn: string) {
    return await this.jwtService.signAsync(user, {
      expiresIn,
      secret: this.configService.get("JWT_SECRET"),
    });
  }

  async verifyToken(token: string) {
    try {
      if (await this.cacheManager.get(token)) {
        throw new AuthFailureError("Token revoked");
      }

      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("JWT_SECRET"),
      });
    } catch (error) {
      throw new ServerError(error);
    }
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.verifyToken(refreshToken);

    const access_token = await this.generateToken(
      {
        _id: payload._id,
        email: payload.email,
        name: payload.name,
      },
      JWT_ACCESS_TOKEN_EXPIRED
    );
    // response.cookie('Authentication', access_token, {
    //   httpOnly: true,
    //   expires: expiresAccessToken,
    // });
    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers`
    // request['user'] = payload;
    // console.log('👌  request:', email);
    // const user = await this.userService.findOne(refeshToken);
    // console.log('👌  user:', user);
    return {
      access_token,
      user: payload,
    };
  }

  async revokeToken(accessToken: string) {
    // First make sure the access token is valid
    const verified = await this.verifyToken(accessToken);
    // Calculate the remaining valid time for the token (in seconds)
    const expiry = verified.exp - Math.floor(Date.now() / 1000);

    // Add the revoked token to Redis and set expiration
    await this.cacheManager.set(accessToken, 1, expiry);

    return verified;
  }

  async logout(accessToken: string) {
    return await this.revokeToken(accessToken);
  }

  // async testRmq() {
  //   this.authClient.emit('hello', {
  //     text: 'Hello worldb scaSDHVSHJVSADFCVASHDGV',
  //   });
  // }

  async testSendMessage() {
    return this.authClient.send(
      {
        cmd: "get-user",
      },
      {
        name: "test",
      }
    );
  }
}
