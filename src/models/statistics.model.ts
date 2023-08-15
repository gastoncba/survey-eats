import mongoose, { Schema } from "mongoose";

const StatisticSchema = new Schema({
  answeredQuestionnaires: {type: Number, default: 0},
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
//   questionStatistics: [
//     {
//       questionnaireId: {
//         type: Schema.Types.ObjectId,
//         ref: "Questionnaire",
//       },
//       question: String,
//       options: [
//         {
//           id: String,
//           name: String,
//           absoluteFrequency: Number,
//           average: { type: Number, default: null },
//           subOptions: [
//             {
//               id: String,
//               name: String,
//               absoluteFrequency: Number,
//               average: { type: Number, default: null },
//             },
//           ],
//         },
//       ],
//     },
//   ],
});

const StatisticModel = mongoose.model("Statistic", StatisticSchema);

export default StatisticModel;
