"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const resolutions = [
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
];
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const rabbitUrl = configService.get("RABBIT_MQ_URI");
    console.log("👌  rabbitUrl:", rabbitUrl);
    const QUEUE = configService.get("RABBIT_MQ_SERVICE_QUEUE");
    console.log("👌  QUEUE:", QUEUE);
    app.connectMicroservice({
        transport: microservices_1.Transport.RMQ,
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
    await app.startAllMicroservices().then(() => {
        console.log("👌 Welcome to Trancoder service...`");
    });
    await app.listen(3000).then(() => {
        console.log("👌 Trancoder service listening port 3000...`");
    });
}
bootstrap();
//# sourceMappingURL=main.js.map