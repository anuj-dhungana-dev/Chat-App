import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import {
  getMessages,
  sendMessages,
  userForSidebar,
} from "../controllers/messages.controllers.js";

const Router = express.Router();

// routers
Router.get("/:id", verifyAuth, getMessages);
Router.get("/users", verifyAuth, userForSidebar);
Router.post("/send/:id", verifyAuth, sendMessages);

export default Router;
