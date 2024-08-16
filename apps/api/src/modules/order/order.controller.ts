import { SuccessResponse } from "@app/shared/core/success.response";
import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { OrderCreatePaymentDto } from "./dto/OrderCreatePayment.dto";
import { OrderService } from "./order.service";

@ApiTags("Order")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @UseGuards(JwtAuthGuard)
  @Get("orders/:key")
  async getAllOrders(@Res() res: Response) {
    new SuccessResponse({
      message: "List order product OK",
      metadata: await this.orderService.getAllOrders(),
    }).send(res);
  }

  @Get("show/:id")
  getOrdersByIdAuth(@Param("id") idAuth: string) {
    return this.orderService.getOrdersByIdAuth(idAuth);
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
  addOrder(@Req() req: Request, @Res() res: Response) {
    return this.orderService.addOrder(req, res);
  }
}
