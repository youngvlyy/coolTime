import { Router } from "express";
import foods, { Food } from "../models/foodModel";

const router = Router();

// 음식 추가
router.post("/", (req, res) => {
  const { name, calories, cooldown } = req.body;
  const newFood: Food = {
    id: Date.now(),
    name,
    calories,
    cooldown,
    lastEaten: null,
    savedCalories: 0,
  };
  foods.push(newFood);
  res.json(newFood);
});

// 음식 먹음 처리
router.post("/:id/eat", (req, res) => {
  const food = foods.find(f => f.id === Number(req.params.id));
  if (!food) return res.status(404).json({ error: "Not found" });
  food.lastEaten = new Date();
  res.json(food);
});

// 절약 칼로리 업데이트 조회
router.get("/", (req, res) => {
  const today = new Date();
  foods.forEach(food => {
    if (food.lastEaten) {
      const diffDays = Math.floor((today.getTime() - food.lastEaten.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= food.cooldown) {
        food.savedCalories += food.calories;
        food.lastEaten = null;
      }
    } else {
      food.savedCalories += food.calories;
    }
  });
  res.json(foods);
});

export default router;
