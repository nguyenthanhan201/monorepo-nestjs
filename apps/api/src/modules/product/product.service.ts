import { BadRequestError } from "@app/shared/core/error.response";
import { GenericFilter, PageService } from "@app/shared/services/page.service";
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cache } from "cache-manager";
import { Model } from "mongoose";
import slugify from "slugify";
import { ProductProducer } from "../../common/jobs/providers/product.job.producer";
import { ProductCreateDto } from "./dto/productCreate.dto";
import { Product, ProductDocument } from "./product.model";

@Injectable()
export class ProductService extends PageService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private httpService: HttpService,
    private readonly productProducer: ProductProducer
  ) {
    super();
  }

  async getProducts(filter: GenericFilter, key: string | undefined) {
    const products = await this.getAllProducts(key);
    // console.log("👌  products:", products);
    // const paginatedProducts = await this.paginateByMongoose(
    //   this.productModel,
    //   filter
    // );

    return {
      products,
      // paginatedProducts,
    };
  }

  async getAllSlugs(): Promise<string[]> {
    return await this.productModel
      .find({ deletedAt: null })
      .select("slug")
      .lean()
      .then((res) => res.map((item) => item.slug));
  }

  async getAllProducts(key: string | undefined): Promise<ProductCreateDto[]> {
    const products = await this.productModel
      .find(
        {
          deletedAt: null,
          // _id: {
          //   $gt: '63cc11a770aa10b29d2bc3c0',
          // },
        }
        // null,
        // {
        //   sort: {
        //     _id: 1,
        //   },
        //   skip: 0,
        //   limit: 10,
        // },
      )
      .lean(); // use lean() to return plain JS object instead of Mongoose document

    if (key) {
      await this.cacheManager.set(key, products, 60 * 60 * 24 * 7); // 7 days
    }
    return products;
  }

  async getAllHideProducts(): Promise<Product[]> {
    const hideProducts = await this.productModel
      .find({
        deletedAt: { $ne: null },
      })
      .lean();

    // await this.cacheManager.set(key, hideProducts, 60 * 60 * 24 * 7); // 7 days

    return hideProducts;
  }

  async isSlugExists(slug: string): Promise<boolean> {
    const existingItem = await this.productModel.findOne({ slug }).exec();
    return !!existingItem;
  }

  async createProduct(
    productData: ProductCreateDto
  ): Promise<ProductCreateDto> {
    const baseSlug = slugify(productData.title, { lower: true });
    let counter = 1;

    while (await this.isSlugExists(`${baseSlug}-${counter}`)) {
      counter++;
    }

    const slug = counter > 1 ? `${baseSlug}-${counter}` : baseSlug;
    const product = new this.productModel({ ...productData, slug });

    return product.save().then(
      (res) => {
        return res;
      },
      (error) => {
        console.log("Error creating product:", error);
        throw new HttpException(
          "Failed to create product",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    );
  }

  async updateProductByIdProduct(
    productData: ProductCreateDto,
    idProduct: string
  ): Promise<ProductCreateDto> {
    return await this.productModel
      .findOneAndUpdate({ _id: idProduct }, productData, { new: true })
      .then(
        (res) => {
          return res;
        },
        (error) => {
          // console.log("Error update product:", error);
          throw new BadRequestError(error.message);
        }
      );
  }

  async hideProductByIdProduct(idProduct: string): Promise<ProductCreateDto> {
    console.log("👌  idProduct:", idProduct);
    return await this.productModel
      .findOneAndUpdate(
        { _id: idProduct },
        { deletedAt: new Date() },
        { new: true }
      )
      .then(
        (res) => {
          return res;
        },
        (error) => {
          console.log("Error hide product:", error);
          throw new HttpException(
            "Failed to unhide product",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      );
  }

  async unhideProductByIdProduct(idProduct: string): Promise<ProductCreateDto> {
    return await this.productModel
      .findOneAndUpdate({ _id: idProduct }, { deletedAt: null }, { new: true })
      .then(
        (res) => res,
        (error) => {
          console.log("Error unhide product:", error);
          throw new HttpException(
            "Failed to unhide product",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      );
  }

  async deleteProductByIdProduct(idProduct: string): Promise<ProductCreateDto> {
    return await this.productModel.deleteOne({ _id: idProduct }).then(
      (res) => res as any,
      (error) => {
        console.log("Error delete product:", error);
        throw new HttpException(
          "Failed to delete product",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    );
  }

  async mostViewed(): Promise<ProductCreateDto[]> {
    return await this.productModel
      .find({ deletedAt: null })
      .sort({ view: -1 })
      .limit(10)
      .exec();
  }

  async updateView(idProduct: string): Promise<ProductCreateDto> {
    return await this.productModel
      .findOneAndUpdate(
        { _id: idProduct },
        { $inc: { view: 1 } },
        { new: true }
      )
      .then(
        (res) => res,
        (error) => {
          console.log("Error update view product:", error);
          throw new HttpException(
            "Failed to update view product",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      );
  }
}
