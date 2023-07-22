import { config } from "../config/config";
import mongoose from "mongoose";

export async function initialize() {
  await mongoose.connect(config.uri)
}
