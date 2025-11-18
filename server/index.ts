import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRouter);
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


const PORT = 4000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined!");
  process.exit(1); // 아예 서버 실행 중단
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT,"0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
