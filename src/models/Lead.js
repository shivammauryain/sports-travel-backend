import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
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
    },
    numberOfTravelers: {
      type: Number,
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Quote Sent", "Interested", "Closed Won", "Closed Lost"],
      default: "New",
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
