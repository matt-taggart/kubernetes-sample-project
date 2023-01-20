import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema({
  id: mongoose.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  accessToken: String,
  refreshToken: String,
  greetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Greeting" }],
});

customerSchema.pre("save", async function (next) {
  const SALT_ROUNDS = 10;

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

customerSchema.methods.comparePasswords = async function (password) {
  try {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  } catch (error) {
    return false;
  }
};

export const CustomerModel = mongoose.model("Customer", customerSchema);
