import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CartItem, CartItemSchema } from "../cart-item/cart-item.model";
import { Product, ProductSchema } from "../product/product.model";
import { Rating, RatingSchema } from "../rating/rating.model";
import { RatingService } from "../rating/rating.service";
import { ItemOrder, ItemOrderSchema } from "./itemOrder.model";
import { OrderController } from "./order.controller";
import { Order, OrderSchema } from "./order.model";
import { OrderService } from "./order.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: ItemOrder.name, schema: ItemOrderSchema },
      { name: CartItem.name, schema: CartItemSchema },
      { name: Rating.name, schema: RatingSchema },
    ]),
  ],
  providers: [OrderService, RatingService],
  controllers: [OrderController],
})
export class OrderModule {}
