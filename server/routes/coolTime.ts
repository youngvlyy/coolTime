import { Router } from "express";
import foods, { Food } from "../models/foodModel";
import express, { Request, Response } from "express";
import Cooltime, { ICooltime } from "../models/coolTime";

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

// 목표 저장
router.post("/:uid", async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const { foodName, calories, startDate, targetDate } = req.body;

    const newGoal = new Cooltime({
      uid,
      foodName,
      calories,
      startDate,
      targetDate,
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err: any) {
    res.status(500).json({ error: "쿨타임 저장 실패", details: err.message });
  }
});

// 목표 불러오기
router.get("/:uid", async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const goals: ICooltime[] = await Cooltime.find({ uid });
    res.json(goals);
  } catch (err: any) {
    res.status(500).json({ error: "쿨타임 불러오기 실패", details: err.message });
  }
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
