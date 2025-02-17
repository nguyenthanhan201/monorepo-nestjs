import { BadRequestError } from "@app/shared/core/error.response";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cache } from "cache-manager";
import { Model, Types } from "mongoose";
import { Brand, BrandDocument } from "./brand.model";
import { BrandCreateDto } from "./dto/brandCreate.dto";

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModal: Model<BrandDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  getAllBrandsByUserId(userId: Types.ObjectId) {
    // console.log("👌  userId:", userId);
    return this.brandModal.find({ createdByUserId: userId });
  }

  async createBrand(data: BrandCreateDto) {
    try {
      const isUserExist = await this.brandModal
        .findOne({
          createdByUserId: data.createdByUserId,
        })
        .exec();

      if (isUserExist) {
        throw new BadRequestError("User already created brand");
      }

      const newBrand = new this.brandModal(data);

      return newBrand.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestError(error.message);
    }
  }

  async updateDesign(brandId: Types.ObjectId, design: string, preview: string) {
    return this.brandModal.updateOne(
      { _id: brandId },
      { design, preview },
      { new: true }
    );
  }

  async getAllBrands(key: string) {
    const brands = await this.brandModal.find().lean();

    this.cacheManager.set(key, brands, 60 * 60 * 24 * 7); // 7 days
    return brands;
  }

  async getOneBrand(brandId: string) {
    const brand = await this.brandModal.findById(brandId);

    if (!brand) {
      throw new HttpException("Brand not found", 404);
    }

    return brand;
  }
}
