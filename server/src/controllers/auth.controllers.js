import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Joi from "joi";
import { generateTokenAndSetCookies } from "../lib/generateTokenAndSetCookies.js";
import cloudinary from "../lib/cloudinary.js";
dotenv.config();

// const userSchema = Joi.object({
//   firstName: Joi.string().min(2).max(30).required(),
//   middleName: Joi.string().allow(""),
//   lastName: Joi.string().min(2).max(30).required(),
//   userName: Joi.string().min(3).max(20).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string()
//     .min(8)
//     .pattern(/(?=.*[A-Z])/)
//     .message("Must contain at least one uppercase letter")
//     .pattern(/(?=.*\d)/)
//     .message("Must contain at least one number")
//     .pattern(/(?=.*[@$!%*?&])/)
//     .message("Must contain at least one special character")
//     .required(),
//   gender: Joi.string().valid("male", "female", "other").required(),
// });

export const signUp = async (req, res) => {
  try {
    // Validate user input
    // const { error } = userSchema.validate(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: error.details[0].message });
    // }

    const { firstName, lastName, userName, email, password, gender } = req.body;

    // Check if the email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already used" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      gender,
      //Ensure lastUsernameUpdate is properly set
      lastUsernameUpdate: new Date(),
    });

    if (user) {
      // Generate token and set cookies
      generateTokenAndSetCookies(res, user._id);

      // Remove password from response
      const newUser = user.toObject();
      delete newUser.password;

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        newUser,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookies(res, user._id);
    // response without Password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      userResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logOut = (req, res) => {
  try {
    res.clearCookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.userId;
    console.log(profilePic);
    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }
    const userResponse = await cloudinary.uploader.upload(profilePic);
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: userResponse.secure_url },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Profile Picture updated successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
