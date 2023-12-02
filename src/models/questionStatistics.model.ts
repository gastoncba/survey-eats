import mongoose, { Schema } from "mongoose";

const QuestionStatistics = new Schema({
  questionnaireId: {
    type: Schema.Types.ObjectId,
    ref: "Questionnaire",
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question"
  },
  options: [
    {
      id: String,
      name: String,
      absoluteFrequency: Number,
      average: { type: Number, default: null },
      totalStars: { type: Number, default: null },
      subOptions: [
        {
          question: String,
          id: String,
          name: String,
          absoluteFrequency: Number,
        },
      ],
    },
  ], 
});

const QuestionStatisticModel = mongoose.model("QuestionStatistic", QuestionStatistics);

export default QuestionStatisticModel;