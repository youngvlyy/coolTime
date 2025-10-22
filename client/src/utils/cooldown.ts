import { FOOD_LIST } from "../models/db";

export const calcBMI = (height: number, weight: number): number => {
  const fullBmi = weight / ((height / 100) ** 2);
  const bmi = Number(fullBmi.toFixed(2));
  return bmi;
};

export const calcCooldown = (foodName: string, bmi: number): number => {
  const foodCalories = FOOD_LIST.find((food) => food.name === foodName)?.calories || 500;

  let base = 7;
  if (bmi >= 25) base += 7;       // 과체중 → 쿨타임 +7일
  else if (bmi < 18.5) base -= 2; // 저체중 → 쿨타임 -2일

  if (foodCalories > 500) base += 1;
  if (foodCalories < 200) base -= 1;

  return Math.max(base, 1); // 최소 1일
};
