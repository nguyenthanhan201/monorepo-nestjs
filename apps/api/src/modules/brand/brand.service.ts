import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Brand, BrandDocument } from "./brand.model";
import { BrandCreateDto } from "./dto/brandCreate.dto";

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModal: Model<BrandDocument>,
    private httpService: HttpService
  ) {}

  getAllBrandsByUserId(userId: Types.ObjectId) {
    console.log("👌  userId:", userId);
    return this.brandModal.find({ createdByUserId: userId });
  }

  createBrand(data: BrandCreateDto) {
    try {
      const isUserExist = this.brandModal.findOne({
        createdByUserId: data.createdByUserId,
      });

      if (isUserExist) {
        throw new HttpException("User already created brand", 400);
      }

      const newBrand = new this.brandModal(data);

      return newBrand.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  updateDesign(brandId: Types.ObjectId, design: string, preview: string) {
    return this.brandModal.updateOne(
      { _id: brandId },
      { design, preview },
      { new: true }
    );
  }

  async getAllBrands() {
    return this.brandModal.find();
  }

  async getOneBrand(brandId: string) {
    const brand = await this.brandModal.findById(brandId);

    if (!brand) {
      throw new HttpException("Brand not found", 404);
    }

    return brand;
  }
}
