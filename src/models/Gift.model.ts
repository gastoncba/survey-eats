import mongoose, { Schema } from "mongoose";

const GiftSchema = new Schema({
  name: String,
  description: String,
  validDays: Number
});

const GiftModel = mongoose.model("Gift", GiftSchema);

export default GiftModel;