import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    adjustments: {
      seasonalMultiplier: { value: Number, percentage: Number },
      earlyBirdDiscount: { value: Number, percentage: Number },
      lastMinuteSurcharge: { value: Number, percentage: Number },
      groupDiscount: { value: Number, percentage: Number },
      weekendSurcharge: { value: Number, percentage: Number },
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    numberOfTravelers: {
      type: Number,
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);
