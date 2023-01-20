import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const cardSchema = new mongoose.Schema({
  id: mongoose.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  accessToken: String,
  refreshToken: String,
});

export const CustomerModel = mongoose.model("card", customerSchema);
