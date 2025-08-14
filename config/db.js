import mongoose from "mongoose";

const connect_DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDb connect");
  } catch (error) {
    console.log("MongoDb connect error", error.message);
  }
};

export default connect_DB;
