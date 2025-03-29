import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      enum: ["Female", "Male"],
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
export default User;
