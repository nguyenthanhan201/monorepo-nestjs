import { TrancoderService } from "@app/shared/services/trancoder.service";
import { getRemoteFile } from "@app/shared/utils/file";
import { Controller, Get } from "@nestjs/common";
import { Ctx, MessagePattern, RmqContext } from "@nestjs/microservices";
import * as path from "path";
import { AppService } from "./app.service";

interface IMessage {
  pattern: {
    cmd: string;
  };
  data: {
    fileId: string;
    url: string;
  };
  id: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trancoderService: TrancoderService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @EventPattern('hello')
  // // async hello(text: string) {
  // async hello(@Payload() data: number[], @Ctx() context: RmqContext) {
  //   console.log('👌  data:', data);
  //   // console.log('👌  text:', text);
  //   // return text;
  //   console.log('👌  data:', context.getMessage().content.toString());
  //   // context.getChannelRef().ack(context.getMessage());
  //   return data;
  // }

  @MessagePattern({ cmd: "transcoder" })
  async transcoder(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);

    const formatMessage: IMessage = JSON.parse(
      originalMessage.content.toString()
    );

    const {
      data: { fileId, url },
    } = formatMessage;

    const videoName = `${fileId}.mp4`;
    const pathVideo = path.resolve(videoName);

    await getRemoteFile(`${fileId}.mp4`, url);

    const videoUrl = await this.trancoderService.transcoderProcess({
      mp4FileName: videoName,
      mp4Path: pathVideo,
    });

    return {
      videoUrl,
    };
  }
}
