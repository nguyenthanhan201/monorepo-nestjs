import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as compression from "compression";
import { DeleteCacheInterceptor } from "./common/interceptors/deleteCache.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { AppModule } from "./modules/app.module";

const configSwagger = new DocumentBuilder()
  .addBearerAuth(
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      in: "header",
      name: "Authorization",
      description: "Enter your Bearer token",
    },
    "bearer"
  )
  .addSecurityRequirements("bearer")
  .setTitle("Admin test")
  .setDescription("The admin API description")
  .setVersion("1.0")
  .build();

const optionsCompress = {
  level: 6, // set compression level from 1 to 9 (6 by default)
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      // don't compress responses with this request header
      return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
  },
};

// const optionsRateLimit: Partial<Options> = {
//   windowMs: 1 * 60 * 1000, // 1 minutes
//   max: 100000, // limit each IP to 100,000 requests per windowMs
// };

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });
  const configService = app.get(ConfigService);

  const NODE_ENV = configService.get("NODE_ENV");

  // app.use('trust proxy', 1); // trust first proxy

  app.setGlobalPrefix("api/v1");

  app.enableCors({
    origin: [
      "https://demo-sigma-smoky.vercel.app",
      "https://nginx-1-0-0.onrender.com",
      // /localhost:\d{4}/,
      "http://localhost:3002",
    ],
    // origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  // app.use(rateLimit(optionsRateLimit));

  app.use(compression(optionsCompress));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app.use(cookieParser());

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalInterceptors(new DeleteCacheInterceptor(app.get(CACHE_MANAGER)));

  // app.useGlobalInterceptors(new ResponseInterceptor());

  // app.useGlobalFilters(new ThrottlerExceptionFilter());

  if (NODE_ENV === "development") {
    const document = SwaggerModule.createDocument(app, configSwagger, {
      ignoreGlobalPrefix: false,
    });

    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true,
      },
    });
  }

  await app.listen(8080, () => {
    console.log("👌 Service listening port 8080...");
  });
}
bootstrap();
