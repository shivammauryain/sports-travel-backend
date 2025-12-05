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
    },
    description: {
      type: String,
      maxLength: 1000,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    inclusions: [String],
    duration: {
      type: Number,
      required: true,
    },
    accommodationType: {
      type: String,
    },
    maxTravelers: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
