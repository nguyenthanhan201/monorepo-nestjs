import { Controller, Get, Param, Req } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { Request } from "express";
import { Public } from "../common/decorators/allow-unauthorize-request.decorator";

@Controller("app")
export class AppController {
  constructor() {}

  @Public()
  @Get()
  getHello(@Req() request: Request) {
    return "Hello World! deploy";
  }

  @Public()
  @Get(":id")
  getHello2(@Param("id") id: string): string {
    console.log("👌  id:", id);
    // console.log('👌  request:', request.cookies.token);
    return id;
  }

  @EventPattern("hello")
  // async hello(text: string) {
  async hello(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log("👌  data:", data);
    // console.log('👌  text:', text);
    // return text;
    console.log("👌  data:", context.getMessage().content.toString());
    // context.getChannelRef().ack(context.getMessage());
    return data;
  }
}
