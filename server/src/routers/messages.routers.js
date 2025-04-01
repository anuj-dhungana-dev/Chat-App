import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";

const Router = express.Router();

// routers
Router.get("/:id", getMessages);
Router.post("/sendmessages", sendMessages);
Router.post("/users", verifyAuth, userForSidebar);

export default Router;
