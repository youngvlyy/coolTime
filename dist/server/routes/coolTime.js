"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const foodModel_1 = __importDefault(require("../models/foodModel"));
const router = (0, express_1.Router)();
// 음식 추가
router.post("/", (req, res) => {
    const { name, calories, cooldown } = req.body;
    const newFood = {
        id: Date.now(),
        name,
        calories,
        cooldown,
        lastEaten: null,
        savedCalories: 0,
    };
    foodModel_1.default.push(newFood);
    res.json(newFood);
});
// 음식 먹음 처리
router.post("/:id/eat", (req, res) => {
    const food = foodModel_1.default.find(f => f.id === Number(req.params.id));
    if (!food)
        return res.status(404).json({ error: "Not found" });
    food.lastEaten = new Date();
    res.json(food);
});
// 절약 칼로리 업데이트 조회
router.get("/", (req, res) => {
    const today = new Date();
    foodModel_1.default.forEach(food => {
        if (food.lastEaten) {
            const diffDays = Math.floor((today.getTime() - food.lastEaten.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays >= food.cooldown) {
                food.savedCalories += food.calories;
                food.lastEaten = null;
            }
        }
        else {
            food.savedCalories += food.calories;
        }
    });
    res.json(foodModel_1.default);
});
exports.default = router;
