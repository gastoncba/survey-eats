import mongoose, { Schema } from "mongoose";

export enum EntityToCompare {
  AGE = "comensal.edad",
  FRANCHISE = "franchise",
  DAY = "days",
  ANSWERED = "Answered option",
}

export enum Operator {
  IS = "IS",
  IS_ONE_OF = "IS_ONE_OF",
  IS_NOT_ONE_OF = "IS_NOT_ONE_OF",
  IS_MORE_THAN = "IS_MORE_THAN",
  IS_LESS_THAN = "IS_LESS_THAN",
  BETWEEN = "BETWEEN",
}

const ConditionSchema = new Schema({
  entityToCompare: {
    type: String,
    enum: [
      EntityToCompare.ANSWERED,
      EntityToCompare.DAY,
      EntityToCompare.AGE,
      EntityToCompare.FRANCHISE,
    ],
  },
  operator: {
    type: String,
    enum: [
      Operator.IS,
      Operator.BETWEEN,
      Operator.IS_LESS_THAN,
      Operator.IS_MORE_THAN,
      Operator.IS_NOT_ONE_OF,
      Operator.IS_ONE_OF,
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
