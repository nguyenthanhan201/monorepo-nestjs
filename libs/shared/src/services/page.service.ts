import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { FilterQuery, Model } from "mongoose";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class GenericFilter {
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  @Min(1, { message: ' "page" attribute should be greater than 1' })
  public page: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  @Min(5, { message: ' "pageSize" attribute should be greater than 5' })
  public pageSize: number = 5;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}

export type PaginateResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
};

export class PageService {
  protected createOrderQuery(filter: GenericFilter) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;
      return order;
    }

    order.createdAt = SortOrder.DESC;
    return order;
  }

  protected async paginateByMongoose<T>(
    // repository: Repository<T>,
    model: Model<T>,
    filter: GenericFilter,
    where?: FilterQuery<T>
  ): Promise<PaginateResponse<T>> {
    const results = await Promise.all([
      model
        .find(where)
        .skip((filter.page - 1) * filter.pageSize)
        .limit(filter.pageSize),
      model.countDocuments().exec(),
    ]);

    // return repository.findAndCount({
    //   order: this.createOrderQuery(filter),
    //   skip: (filter.page - 1) * (filter.pageSize + 1),
    //   take: filter.pageSize,
    //   where: where,
    // });
    return {
      data: results[0],
      total: results[1],
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(results[1] / filter.pageSize),
    };
  }
}
