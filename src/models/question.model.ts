import mongoose, { Schema } from "mongoose";

export enum QuestionType {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

const QuestionSchema = new Schema({
  positiveQuestion: String,
  negativeQuestion: {
    type: String,
    default: null,
  },
  multipleSelection: Boolean,
  starToDisplayPositive: Number,
  type: {
    type: String,
    enum: [QuestionType.OPEN, QuestionType.CLOSED],
    default: QuestionType.OPEN,
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

export default QuestionModel;
