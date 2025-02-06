import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUser } from "../../common/decorators/get-user.decorator";
import { User } from "../user/user.model";
import { CartItemService } from "./cart-item.service";
import { CartItemCreateDto } from "./dto/CartItemCreate.dto";
import { CartItemDeleteDto } from "./dto/CartItemDelete.dto";

@ApiTags("Cart Item")
@Controller("cart-item")
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get()
  async getCartItemsByIdAuth(@GetUser() userInfo: User) {
    return this.cartItemService.getCartItemsByIdAuth(userInfo._id);
  }

  @Post("create")
  create(@Body() body: CartItemCreateDto) {
    return this.cartItemService.create(body);
  }

  @Post("delete")
  delete(@Body() body: CartItemDeleteDto) {
    return this.cartItemService.delete(body);
  }

  @Post("clear-cart")
  clearCart(@Body() body: any) {
    return this.cartItemService.clearCart(body);
  }
}
