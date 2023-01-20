import mongoose from "mongoose";

const greetingSchema = new mongoose.Schema({
  id: mongoose.ObjectId,
  prompt: String,
  generatedText: String,
});

export const GreetingModel = mongoose.model("Greeting", greetingSchema);
