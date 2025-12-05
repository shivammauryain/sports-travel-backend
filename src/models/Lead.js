import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null,
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
    status: {
      type: String,
      enum: [ "New", "Contacted", "Quote Sent", "Interested", "Closed Won", "Closed Lost" ],
      default: "New",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ eventId: 1, status: 1 });
leadSchema.index({ email: 1 });

export default mongoose.model("Lead", leadSchema);
