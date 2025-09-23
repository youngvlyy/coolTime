import mongoose, { Schema, Document } from "mongoose";

export interface ICoolFood {
  _id?: string;
  name: string;
  calories: number;
  cooldown: number;
  lastEaten: Date | null;
  savedCalories: number;
}

export interface IUser extends Document {
  uid: string;
  email: string;
  coolFoods: ICoolFood[];
}

const CoolFoodSchema = new Schema<ICoolFood>({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  cooldown: { type: Number, required: true },
  lastEaten: { type: Date, default: null },
  savedCalories: { type: Number, default: 0 },
});

const UserSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  coolFoods: [CoolFoodSchema],
});

export default mongoose.model<IUser>("User", UserSchema);
