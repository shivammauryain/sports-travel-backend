import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 1000,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: [0, "Base price cannot be negative"],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    duration: {
      type: Number, // in days
      required: true,
      min: [1, "Duration must be at least 1"],
    },
    accommodationType: {
      type: String,
      trim: true,
    },
    maxTravelers: {
      type: Number,
      min: [1, "Max travelers must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.index({ eventId: 1 });

export default mongoose.model("Package", packageSchema);
