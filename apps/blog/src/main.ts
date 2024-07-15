import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("blog/v1");

  // app.enableCors({
  //   origin: ["https://nginx-1-0-0.onrender.com", /localhost:\d{4}/],
  //   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  //   credentials: true,
  // });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(8082, () => {
    console.log("👌 Service listening port 8082...");
  });
}
bootstrap();
