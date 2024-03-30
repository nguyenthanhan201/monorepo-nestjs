import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from './cart-item.model';
import { CartItemCreateDto } from './dto/CartItemCreate.dto';
import { CartItemDeleteDto } from './dto/CartItemDelete.dto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItemDocument>,
  ) {}

  async getCartItemsByIdAuth(idAuth: string): Promise<any> {
    const cartItems = await this.cartItemModel
      .find({ idAuth })
      .populate('idProduct')
      .then((cartItems) => {
        // groupBy cartItem by idProduct and size and color
        const grouped = {};

        cartItems.forEach(function (a: any) {
          if (grouped[a.idProduct._id + a.size + a.color]) {
            grouped[a.idProduct._id + a.size + a.color][0].quantity +=
              a.quantity;
          } else {
            grouped[a.idProduct._id + a.size + a.color] = [a];
          }
        });

        return grouped;
      });

    return cartItems;
  }

  async create(cartItemData: CartItemCreateDto) {
    const newCartItem = new this.cartItemModel(cartItemData);
    return newCartItem.save().then(
      (res) => res,
      (error) => {
        console.log('👌  error createCartItem:', error);
        throw new HttpException(error, 400);
      },
    );
  }

  async delete(body: CartItemDeleteDto) {
    const { color, idAuth, idProduct, size } = body;
    console.log('👌  idAuth:', color, idAuth, idProduct, size);

    return this.cartItemModel.deleteMany({
      idAuth,
      color,
      idProduct,
      size,
    });
  }

  async clearCart(body) {
    return this.cartItemModel.deleteMany({
      idAuth: body.idAuth,
    });
  }
}
