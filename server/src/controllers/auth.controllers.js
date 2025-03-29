import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Joi from "joi";
import { generateTokenAndSetCookies } from "../lib/generateTokenAndSetCookies.js";
dotenv.config();

const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  middleName: Joi.string().allow(""),
  lastName: Joi.string().min(2).max(30).required(),
  userName: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/(?=.*[A-Z])/)
    .message("Must contain at least one uppercase letter")
    .pattern(/(?=.*\d)/)
    .message("Must contain at least one number")
    .pattern(/(?=.*[@$!%*?&])/)
    .message("Must contain at least one special character")
    .required(),
  gender: Joi.string().valid("male", "female", "other").required(),
});

export const signUp = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const {
      firstName,
      middleName,
      lastName,
      userName,
      email,
      password,
      gender,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already used" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      middleName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      gender,
    });
    generateTokenAndSetCookies(res, user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
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
    delete user.password;
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
    const { firstName, middleName, lastName, userName, gender } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (req.body.email && req.body.email !== user.email) {
      return res
        .status(400)
        .json({ success: false, message: "Email cannot be updated" });
    }

    if (userName && user.userName !== userName) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (user.lastUsernameUpdate && user.lastUsernameUpdate > oneMonthAgo) {
        return res.status(400).json({
          success: false,
          message: "Username can only be updated once a month",
        });
      }
      user.userName = userName;
      user.lastUsernameUpdate = new Date();
    }

    user.firstName = firstName;
    user.middleName = middleName;
    user.lastName = lastName;
    user.gender = gender;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
