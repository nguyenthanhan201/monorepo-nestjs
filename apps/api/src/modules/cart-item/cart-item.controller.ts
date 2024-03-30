import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartItemService } from './cart-item.service';
import { CartItemCreateDto } from './dto/CartItemCreate.dto';
import { CartItemDeleteDto } from './dto/CartItemDelete.dto';

@ApiTags('Cart Item')
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get(':id')
  getCartItemsByIdAuth(@Param('id') idAuth: string) {
    return this.cartItemService.getCartItemsByIdAuth(idAuth);
  }

  @Post('create')
  create(@Body() body: CartItemCreateDto) {
    return this.cartItemService.create(body);
  }

  @Post('delete')
  delete(@Body() body: CartItemDeleteDto) {
    return this.cartItemService.delete(body);
  }

  @Post('clear-cart')
  clearCart(@Body() body: any) {
    return this.cartItemService.clearCart(body);
  }
}
