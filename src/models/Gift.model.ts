import mongoose, { Schema } from "mongoose";

const GiftSchema = new Schema({
  name: String,
  description: String,
  validDays: Number,
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
});

const GiftModel = mongoose.model("Gift", GiftSchema);

export default GiftModel;