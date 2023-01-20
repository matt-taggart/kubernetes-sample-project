import mongoose from "mongoose";

const greetingSchema = new mongoose.Schema({
  id: mongoose.ObjectId,
  prompt: String,
  generatedText: String,
  userId: mongoose.ObjectId,
});

export const GreetingModel = mongoose.model("Greeting", greetingSchema);
