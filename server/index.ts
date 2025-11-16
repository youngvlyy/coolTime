import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api/user", userRouter);
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


// SPA 처리: React 빌드의 index.html을 반환
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});




const PORT = 4000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined!");
  process.exit(1); // 아예 서버 실행 중단
}

// const MONGO_URI = "mongodb://localhost:27017/cooltimeDB";
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
