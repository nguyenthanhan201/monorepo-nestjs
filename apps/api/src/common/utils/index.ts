import mongoose from 'mongoose';

const convertToObjectIdMongodb = (id) => {
  return new mongoose.Types.ObjectId(id);
};

export { convertToObjectIdMongodb };
