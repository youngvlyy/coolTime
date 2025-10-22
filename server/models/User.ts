import mongoose, { Schema, Document } from "mongoose";

export interface ICoolFood {
  _id: string;
  name: string;
  cooldown: number,
  lastEaten: string; // timestamp (ms)
}

export interface BodyProfile {
  height: number;
  weight: number;
  bmi : number;
}

export interface IUser extends Document {
  uid: string;
  email: string;
  body : BodyProfile[];
  food : ICoolFood[];
}

const BodyProfileSchema = new Schema<BodyProfile>(
  {
  height: {type: Number, required: true},
  weight: {type: Number, required: true},
  bmi: {type: Number, required: true}
  }
)
const CoolFoodSchema = new Schema<ICoolFood>({
  name: { type: String, required: true },
  lastEaten: { type: String, required: true },
  cooldown: { type: Number, default: 0 },
  _id: { type: String, required: true }
});

const UserSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  body: [BodyProfileSchema],
  food: [CoolFoodSchema]
});

export default mongoose.model<IUser>("User", UserSchema);
