import express from "express";
import {
  logIn,
  logOut,
  signUp,
  updateProfile,
} from "../controllers/auth.controllers.js";

const Router = express.Router();

// routers
Router.post("/signup", signUp);
Router.post("/login", logIn);
Router.post("/logout", logOut);
Router.post("/update", updateProfile);

export default Router;
