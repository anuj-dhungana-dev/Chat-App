import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }
    const decode = jwt.verify( token , process.env.JWT_KEY);
    // console.log(`this is decode:-`, decode);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token.",
      });
    }
    req.userId = decode.userId;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "server error in VerifyAuth" });
  }
};
