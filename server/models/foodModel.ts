export interface Food {
  id: number;
  name: string;
  calories: number;
  cooldown: number;
  lastEaten: Date | null;
  savedCalories: number;
}

let foods: Food[] = [];

export default foods;
