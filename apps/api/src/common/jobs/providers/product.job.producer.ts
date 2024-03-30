import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Product } from "apps/api/src/modules/product/product.model";
import { Queue } from "bull";

@Injectable()
export class ProductProducer {
  constructor(@InjectQueue("product") private readonly product: Queue) {}

  async cacheProductsToRedis(products: Array<Product>) {
    await this.product.add(
      "cache-products",
      {
        products,
      },
      {
        removeOnComplete: true,
        delay: 1000,
      }
    );
  }
}
