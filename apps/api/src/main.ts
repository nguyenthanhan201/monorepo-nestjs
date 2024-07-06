import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as compression from "compression";
import { ThrottlerExceptionFilter } from "./common/filters";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { AppModule } from "./modules/app.module";

const configSwagger = new DocumentBuilder()
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
  const app = await NestFactory.create(AppModule);

  // app.use('trust proxy', 1); // trust first proxy

  app.setGlobalPrefix("api/v1");

  app.enableCors({
    origin: ["https://nginx-1-0-0.onrender.com", /localhost:\d{4}/],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  // app.use(rateLimit(optionsRateLimit));

  app.use(compression(optionsCompress));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app.use(cookieParser());

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new ThrottlerExceptionFilter());

  const document = SwaggerModule.createDocument(app, configSwagger, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup("swagger", app, document);

  await app.listen(8080, () => {
    console.log("👌 Service listening port 8080...");
  });
}
bootstrap();
