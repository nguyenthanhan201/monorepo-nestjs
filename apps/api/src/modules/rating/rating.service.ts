import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cache } from "cache-manager";
import { Model, Types } from "mongoose";
import { Rating, RatingDocument } from "./rating.model";

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private readonly ratingModel: Model<RatingDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async getRatingByIdAuth(idAuth: Types.ObjectId) {
    return this.ratingModel.find({ idAuth }).populate("idProduct").exec();
  }

  async createRating({ idProduct, idAuth }) {
    const rating = new this.ratingModel({
      idProduct,
      idAuth,
    });

    await rating.save();
  }

  async getRatingByIdProduct(idProduct: string): Promise<any> {
    const cacheKey = `rating:${idProduct}`;
    const cachedRatings = await this.cacheManager.get(cacheKey);
    if (cachedRatings) {
      return cachedRatings;
    }

    const ratings = await this.ratingModel
      .find({ idProduct })
      .populate("idAuth")
      .exec();

    this.cacheManager.set(cacheKey, ratings, 60 * 60 * 24 * 7); // 7 days

    return ratings;
  }

  async updateRatingById(req, res) {
    const id = req.params.id;
    const { rating, comment } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });
    if (!comment) return res.status(400).json({ error: "comment is required" });
    if (!rating) return res.status(400).json({ error: "rating is required" });
    await this.ratingModel
      .findByIdAndUpdate(id, { rating, comment }, { new: true })
      .then((rating) => {
        res.json(rating);
      })
      .catch((err) => {
        return res.status(400).json({ error: err });
      });
  }
}
