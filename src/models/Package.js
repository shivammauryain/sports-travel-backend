import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
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
    features: {
      type: [String],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    tier: {
      type: String,
      enum: ["Premium", "Standard", "Basic", "Economy"],
      default: "Standard",
    },
    duration: {
      type: Number, // in days
      min: [1, "Duration must be at least 1"],
    },
    accommodationType: {
      type: String,
      trim: true,
    },
    maxTravelers: {
      type: Number,
      required: true,
      min: [1, "Max travelers must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.index({ eventId: 1 });
packageSchema.index({ eventId: 1, tier: 1 }, { unique: true });

export default mongoose.model("Package", packageSchema);
