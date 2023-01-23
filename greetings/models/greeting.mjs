import mongoose from "mongoose";

const greetingSchema = new mongoose.Schema(
  {
    id: mongoose.ObjectId,
    prompt: String,
    generatedText: String,
    userId: mongoose.ObjectId,
  },
  { timestamps: true }
);

export const GreetingModel = mongoose.model("Greeting", greetingSchema);
