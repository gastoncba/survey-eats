import mongoose, { Schema } from "mongoose";

const BrandSchema = new Schema({
  name: String,
  questionnaires: [
    {
      type: Schema.Types.ObjectId,
      ref: "Questionnaire",
    },
  ],
});

const BrandModel = mongoose.model("Brand", BrandSchema);

export default BrandModel;
