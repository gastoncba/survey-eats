import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema({
  positiveQuestion: String,
  negativeQuestion: {
    type: String,
    default: null,
  },
  multipleSelection: Boolean,
  starToDisplayPositive: Number,
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

export default QuestionModel;
