import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";

export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decode.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
}