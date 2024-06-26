import { Resolution } from "@app/shared/services/trancoder.service";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

// const targets: ITargetFile[] = [
//   // {
//   //   name: 'remote-jar',
//   //   file: 'jettison.jar',
//   //   url: 'https://repo1.maven.org/maven2/org/codehaus/jettison/jettison/1.3.8/jettison-1.3.8.jar',
//   // },
//   // {
//   //   name: 'remote-pom',
//   //   file: 'jettison.pom',
//   //   url: 'https://repo1.maven.org/maven2/org/codehaus/jettison/jettison/1.3.8/jettison-1.3.8.pom',
//   // },
//   // {
//   //   name: 'remote-mp4',
//   //   file: 'movie_0uq50CYION.mp4',
//   //   url: 'https://ik.imagekit.io/ue5qe7gwv/products/movie_0uq50CYION.mp4?updatedAt=1710408102179',
//   // },
// ];

const resolutions: Resolution[] = [
  {
    resolution: "854x480",
    videoBitrate: "1000k",
    audioBitrate: "128k",
  },
  {
    resolution: "1280x720",
    videoBitrate: "2500k",
    audioBitrate: "192k",
  },
  // {
  //   resolution: "1920x1080",
  //   videoBitrate: "5000k",
  //   audioBitrate: "192k",
  // },
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const rabbitUrl = configService.get("RABBIT_MQ_URI");
  console.log("👌  rabbitUrl:", rabbitUrl);
  const QUEUE = configService.get("RABBIT_MQ_SERVICE_QUEUE");
  console.log("👌  QUEUE:", QUEUE);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
      persistent: true,
    },
  });

  app.startAllMicroservices().then(() => {
    console.log("👌 Welcome to Trancoder service...`");
  });

  await app.listen(8081, () => {
    console.log("👌 Trancoder service listening port 8081...");
  });
}
bootstrap();
