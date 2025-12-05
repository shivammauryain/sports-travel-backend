import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema(
  {
    value: {
      type: Number, 
      default: 0,
    },
    percentage: {
      type: Number, 
      default: 0,
    },
  },
  { _id: false }
);

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
      min: [0, "Base price cannot be negative"],
    },
    adjustments: {
      seasonalMultiplier: {
        type: adjustmentSchema,
        default: () => ({}),
      },
      earlyBirdDiscount: {
        type: adjustmentSchema,
        default: () => ({}),
      },
      lastMinuteSurcharge: {
        type: adjustmentSchema,
        default: () => ({}),
      },
      groupDiscount: {
        type: adjustmentSchema,
        default: () => ({}),
      },
      weekendSurcharge: {
        type: adjustmentSchema,
        default: () => ({}),
      },
    },
    finalPrice: {
      type: Number,
      required: true,
      min: [0, "Final price cannot be negative"],
    },
    numberOfTravelers: {
      type: Number,
      required: true,
      min: [1, "Number of travelers must be at least 1"],
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
  {
    timestamps: true,
  }
);

quoteSchema.index({ leadId: 1, createdAt: -1 });

export default mongoose.model("Quote", quoteSchema);
