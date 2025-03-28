import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dataBaseConnection from "./lib/db.js";
dotenv.config();
const app = express();

//global middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//Routers
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// listen server
const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
  dataBaseConnection();
});
