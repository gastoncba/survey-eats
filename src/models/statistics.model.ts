import mongoose, { Schema } from "mongoose";

const StatisticSchema = new Schema({
  answeredQuestionnaires: { type: Number, default: 0 },
  repurchases: { type: Number, default: 0 },
  averageStars: { type: Number, default: 0 },
  brandId: String,
  questionStatistics: [
    {
      type: Schema.Types.ObjectId,
      ref: "QuestionStatistic",
    },
  ],
});

const StatisticModel = mongoose.model("Statistic", StatisticSchema);

export default StatisticModel;
