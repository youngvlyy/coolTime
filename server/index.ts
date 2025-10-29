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
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// SPA 처리: React 빌드의 index.html을 반환
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});



app.use("/api", userRouter);

const PORT = 4000;

// const MONGO_URI = "mongodb://localhost:27017/cooltimeDB";

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
