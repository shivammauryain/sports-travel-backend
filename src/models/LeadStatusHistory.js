import mongoose from "mongoose";

const leadStatusHistorySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    fromStatus: {
      type: String,
      required: true,
      enum: [ "New", "Contacted", "Quote Sent", "Interested", "Closed Won", "Closed Lost" ],
    },
    toStatus: {
      type: String,
      required: true,
      enum: [ "New", "Contacted", "Quote Sent", "Interested", "Closed Won", "Closed Lost" ],
    },
    changedBy: {
      type: String,
      default: "system",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

leadStatusHistorySchema.index({ leadId: 1, createdAt: -1 });

export default mongoose.model("LeadStatusHistory", leadStatusHistorySchema);
