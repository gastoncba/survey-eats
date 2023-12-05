import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  uri: process.env.MONGO_URL || "",
  apiKey: process.env.API_KEY || "",
  jwtSecret: process.env.JWT_SECRET || "",
};
