import mongoose, { Schema } from "mongoose";

export enum EntityToCompare {
  AGE = "comensal.edad",
  ANSWERED = "Answered option",
}

export enum Operator {
  IS = "IS",
  BETWEEN = "BETWEEN",
}

const ConditionSchema = new Schema({
  entityToCompare: {
    type: String,
    enum: [
      EntityToCompare.ANSWERED,
      EntityToCompare.AGE,
    ],
  },
  operator: {
    type: String,
    enum: [
      Operator.IS,
      Operator.BETWEEN,
    ],
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
  value: String,
});
const ConditionModel = mongoose.model("Condition", ConditionSchema);

export default ConditionModel;
