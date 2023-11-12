import mongoose, { Schema } from "mongoose";

const QuestionStatistics = new Schema({
  questionnaireId: {
    type: Schema.Types.ObjectId,
    ref: "Questionnaire",
  },
  questionId: { type: Schema.Types.ObjectId, ref: "Question" },
  options: [
    {
      id: String,
      name: String,
      absoluteFrequency: Number,
      average: { type: Number, default: 0 },
      totalStars: { type: Number, default: 0 },
      // subOptions: [
      //   {
      //     id: String,
      //     name: String,
      //     absoluteFrequency: Number,
      //     average: { type: Number, default: 0 },
      //   },
      // ],
    },
  ], 
});

const QuestionStatisticModel = mongoose.model("QuestionStatistic", QuestionStatistics);

export default QuestionStatisticModel;