import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRouter);

const PORT = 4000;
const MONGO_URI = "mongodb://localhost:27017/cooltimeDB";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
