import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CartItemSchema } from "../cart-item/cart-item.model";
import { ProductSchema } from "../product/product.model";
import { RatingSchema } from "../rating/rating.model";
import { RatingService } from "../rating/rating.service";
import { ItemOrderSchema } from "./itemOrder.model";
import { OrderController } from "./order.controller";
import { OrderSchema } from "./order.model";
import { OrderService } from "./order.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Order", schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: "ItemOrder", schema: ItemOrderSchema }]),
    MongooseModule.forFeature([{ name: "CartItem", schema: CartItemSchema }]),
    MongooseModule.forFeature([{ name: "Rating", schema: RatingSchema }]),
  ],
  providers: [OrderService, RatingService],
  controllers: [OrderController],
})
export class OrderModule {}
