import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    default: null
  },
  recoveryToken: {
    type: String,
    default: null
  }
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
