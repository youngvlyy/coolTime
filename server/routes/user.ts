import express from "express";
import User, { BodyProfile } from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();


//마이페이지 수정
router.patch("/bodyprofile", async (req, res) => {
  const { uid, email, body, food } = req.body;
  if (!uid || !email || !body) return res.status(400).json({ error: "필수 값 누락" });

  const user = await User.findOne({ uid, email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.body = [body]; // 가장 최근 기록으로 덮어쓰기

  // food 업데이트 (bmi가 바뀌었으니 초기화)
  if (food && food.length) {
    user.food = food.map((f: string) => ({
      _id: new mongoose.Types.ObjectId().toString(),
      name: f,
      cooldown: 0,
      lastEaten: 0,
    }));
  }

  await user.save();

  res.json({ success: true, body: user.body });
});




// 사용자 정보 등록
router.post("/user/:uid/:email", async (req, res) => {
  const { uid, email } = req.params; // ✅ 여기 중요
  if (!uid || !email) return res.status(400).json({ error: "필수 값 누락" });

  let user = await User.findOne({ uid, email });
  if (user) return res.status(409).json({ message: "이미 존재하는 사용자" });

  const newUser = new User({ uid, email, body: [], food: [] });
  await newUser.save();

  res.json({ success: true, uid, email });
});


// 사용자 정보 가져오기
router.get("/user/:uid/:email", async (req, res) => {
  const { uid, email } = req.params;

  try {
    const user = await User.findOne({ uid, email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedUser = {
      uid: user.uid,
      email: user.email,
      body: user.body || [],
      food: user.food || [],
    };

    res.json(formattedUser);

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// 음식 쿨타임 갱신 (PATCH)
router.patch("/user/:uid/food/:foodId", async (req, res) => {
  const { uid, foodId } = req.params;
  const { lastEaten, cooldown } = req.body;

  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const food = user.food.find((f) => f._id === foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    food.lastEaten = lastEaten;
    food.cooldown = cooldown;
    await user.save();

    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
