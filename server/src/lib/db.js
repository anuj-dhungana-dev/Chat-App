import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// database connection using mongoose
const dataBaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DataBase is connected");
  } catch (error) {
    console.log("DataBase Error", error);
  }
};

export default dataBaseConnection;