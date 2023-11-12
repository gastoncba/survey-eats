import mongoose, { Schema } from "mongoose";

const StatisticSchema = new Schema({
  answeredQuestionnaires: { type: Number, default: 0 },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  questionStatistics: [
    {
      type: Schema.Types.ObjectId,
      ref: "QuestionStatistic",
    },
  ],
});

const StatisticModel = mongoose.model("Statistic", StatisticSchema);

export default StatisticModel;
