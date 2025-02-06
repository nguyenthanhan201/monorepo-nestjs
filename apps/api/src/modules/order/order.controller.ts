import { SuccessResponse } from "@app/shared/core/success.response";
import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GetUser } from "../../common/decorators/get-user.decorator";
import { User } from "../user/user.model";
import { OrderCreatePaymentDto } from "./dto/OrderCreatePayment.dto";
import { OrderService } from "./order.service";

@ApiTags("Order")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @UseGuards(JwtAuthGuard)
  @Get("")
  async getAllOrders(@Res() res: Response) {
    new SuccessResponse({
      message: "List order product OK",
      metadata: await this.orderService.getAllOrders(),
    }).send(res);
  }

  @Get("show")
  getOrdersByIdAuth(@GetUser() userInfo: User) {
    return this.orderService.getOrdersByIdAuth(userInfo._id);
  }

  @Post("payment-url")
  createPaymentUrl(@Body() body: OrderCreatePaymentDto) {
    return this.orderService.createPaymentUrl(body);
  }

  @Get("vnpay_return")
  vnpayReturn(@Req() req: Request, @Res() res: Response) {
    return this.orderService.vnpayReturn(req, res);
  }

  @Post("add-order")
  addOrder(
    @Req() req: Request,
    @Res() res: Response,
    @GetUser() userInfo: User
  ) {
    return this.orderService.addOrder(req, res, userInfo._id);
  }
}
