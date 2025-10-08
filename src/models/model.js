import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "uploads", // optional: custom collection name
  }
);

export default mongoose.models.Upload || mongoose.model("Upload", uploadSchema);
