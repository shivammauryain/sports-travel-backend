import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import sendResponse from "../utils/response.js";

export const healthCheck = async (req, res) => {
  try {
    // Mongoose connection status
    const dbState = mongoose.connection.readyState;
    const dbStatus =
      dbState === 1
        ? "connected"
        : dbState === 2
        ? "connecting"
        : dbState === 3
        ? "disconnecting"
        : "disconnected";

    const uptime = process.uptime();

    // Aggregate lead counts
    const leadCounts = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalLeads = await Lead.countDocuments();

    const responseData = {
      status: "healthy",
      uptime: `${Math.floor(uptime)} seconds`,
      database: dbStatus,
      timestamp: new Date().toISOString(),
      metrics: {
        totalLeads,
        leadsByStatus: leadCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      },
    };

    return sendResponse(res, 200, true, responseData, "Health check successful");
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};
