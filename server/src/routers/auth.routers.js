import express from "express";
import {
  logIn,
  logOut,
  signUp,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const Router = express.Router();

// routers
Router.post("/signup", signUp);
Router.post("/login", logIn);
Router.post("/logout", logOut);
Router.put("/update", verifyAuth, updateProfile);

export default Router;
