const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    console.log("Mongoose Connect successfully");
  } catch (err) {
    console.log("Connect failure");
  }
}

module.exports = {
  connect,
};
