import express from "express";

const Router = express.Router();

// routers
Router.get("/getmessages", getMessages);
Router.post("/sendmessages", sendMessages);
// Router.post("/sendmessages", sendMessages);


export default Router;