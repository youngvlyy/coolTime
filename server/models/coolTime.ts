import mongoose, { Document, Schema } from "mongoose";

export interface ICooltime extends Document {
  uid: string;
  foodName: string;
  calories: number;
  startDate: string;  // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
}

const CooltimeSchema: Schema = new Schema({
  uid: { type: String, required: true },
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  startDate: { type: String, required: true },
  targetDate: { type: String, required: true },
});

export default mongoose.model<ICooltime>("Cooltime", CooltimeSchema);
