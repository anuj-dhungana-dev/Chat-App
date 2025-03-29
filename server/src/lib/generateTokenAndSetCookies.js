import jwt from "jsonwebtoken";

export const generateTokenAndSetCookies = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Enables secure flag in production
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Ensures expiration
  });

  return token;
};