import mongoose, { Schema } from "mongoose";

const BrandSchema = new Schema({
  name: String,
  image: {
    type: String,
    default: null,
  },
  questionnaires: [
    {
      type: Schema.Types.ObjectId,
      ref: "Questionnaire",
    },
  ],
});

const BrandModel = mongoose.model("Brand", BrandSchema);

export default BrandModel;
