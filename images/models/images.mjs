import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    id: mongoose.ObjectId,
    prompt: String,
    generatedId: String,
    photoUrl: String,
    status: String,
    userId: mongoose.ObjectId,
  },
  { timestamps: true }
);

export const ImageModel = mongoose.model("Image", imageSchema);
