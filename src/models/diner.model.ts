import mongoose, { Schema } from "mongoose";

const DinerSchema = new Schema({
  email: String,
  brandsVisited: [
    {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
  ],
});

const DinerModel = mongoose.model("Diner", DinerSchema);

export default DinerModel;