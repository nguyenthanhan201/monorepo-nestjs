import mongoose from "mongoose";

const convertToObjectIdMongodb = (id) => {
  return new mongoose.Types.ObjectId(id);
};

const paginate = <T>({
  data,
  page = 1,
  pageSize = 10,
}: {
  data: T[];
  page: number;
  pageSize: number;
}) => {
  return data.slice((page - 1) * pageSize, page * pageSize);
};

export { convertToObjectIdMongodb, paginate };
