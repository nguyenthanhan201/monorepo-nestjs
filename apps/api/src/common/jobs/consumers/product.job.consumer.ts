import { Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { Cache } from 'cache-manager';

@Processor('product')
export class ProductConsumer {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Process('cache-products')
  async cacheProducts(job: Job<unknown>) {
    const products = job.data['products'];
    // console.log('👌  products:', products);

    if (!products) return;
    return await this.cacheManager.set('products', products, 2592000000); // 30 days
  }
}
