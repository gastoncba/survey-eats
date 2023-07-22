import mongoose, { Schema } from "mongoose";

const QuestionChainSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  positiveOptions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Option",
    },
  ],
  negativeOptions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Option",
      },
    ],
    default: null,
  },
  acceptStars: Boolean,
  conditions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Condition",
      },
    ],
    default: null,
  },
});

const QuestionChainModel = mongoose.model("QuestionChain", QuestionChainSchema);

export default QuestionChainModel;
