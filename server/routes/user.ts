import express from "express";
import User, { ICoolFood } from "../models/User";

const router = express.Router();

// GET /:uid/:email → 유저 조회 또는 자동 생성
router.get("/user/:uid/:email", async (req, res) => {
  const { uid, email } = req.params;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, coolFoods: [] });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /:uid/food → 새로운 음식 목표 추가
router.post("/user/:uid/food", async (req, res) => {
  const { name, calories, cooldown } = req.body;
  if (!name || typeof calories !== "number" || typeof cooldown !== "number") {
    return res.status(400).json({ message: "Invalid input" });
  }
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.coolFoods.push({ name, calories, cooldown, lastEaten: null, savedCalories: 0 });
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /:uid/food/:foodId/eat → 오늘 섭취 여부 체크
router.patch("/user/:uid/food/:foodId/eat", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const food = user.coolFoods.find(f => f._id?.toString() === req.params.foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastEaten = food.lastEaten ? new Date(food.lastEaten) : null;
    if (lastEaten && lastEaten >= today) {
      food.lastEaten = today;
      food.savedCalories = 0;
    } else {
      food.savedCalories += food.calories;
      food.lastEaten = today;
    }

    await user.save();
    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
