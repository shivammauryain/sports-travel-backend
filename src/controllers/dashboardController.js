import Lead from "../models/Lead.js";
import Event from "../models/Event.js";
import Package from "../models/Package.js";
import Quote from "../models/Quote.js";
import sendResponse from "../utils/response.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalLeads = await Lead.countDocuments();
    const activeEvents = await Event.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalQuotes = await Quote.countDocuments();

    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate conversion rate
    const closedWonCount = leadsByStatus.find(s => s._id === 'Closed Won')?.count || 0;
    const conversionRate = totalLeads > 0 ? ((closedWonCount / totalLeads) * 100).toFixed(1) : 0;

    // Get recent leads
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLeadsCount = await Lead.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate trend
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const previousPeriodLeads = await Lead.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const leadsTrend = previousPeriodLeads > 0 
      ? (((recentLeadsCount - previousPeriodLeads) / previousPeriodLeads) * 100).toFixed(1)
      : 0;

    // Format status breakdown
    const statusBreakdown = {
      new: leadsByStatus.find(s => s._id === 'New')?.count || 0,
      contacted: leadsByStatus.find(s => s._id === 'Contacted')?.count || 0,
      interested: leadsByStatus.find(s => s._id === 'Interested')?.count || 0,
      quoteSent: leadsByStatus.find(s => s._id === 'Quote Sent')?.count || 0,
      closedWon: closedWonCount,
      closedLost: leadsByStatus.find(s => s._id === 'Closed Lost')?.count || 0
    };

    return sendResponse(res, 200, true, "Dashboard stats retrieved successfully", {
      totalLeads,
      activeEvents,
      totalPackages,
      totalQuotes,
      conversionRate: parseFloat(conversionRate),
      leadsTrend: parseFloat(leadsTrend),
      statusBreakdown
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return sendResponse(res, 500, false, null, error.message);
  }
};

// Get recent leads for dashboard
export const getRecentLeads = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const leads = await Lead.find()
      .populate('eventId', 'name')
      .populate('packageId', 'name tier')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email phone status eventId packageId createdAt updatedAt');

    return sendResponse(res, 200, true, "Recent leads retrieved successfully", leads);
  } catch (error) {
    console.error("Get recent leads error:", error);
    return sendResponse(res, 500, false, null, error.message);
  }
};

// Get recent quotes for dashboard
export const getRecentQuotes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const quotes = await Quote.find()
      .populate('leadId', 'name email')
      .populate('eventId', 'name')
      .populate('packageId', 'name tier')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('leadId eventId packageId finalPrice status createdAt validUntil');

    return sendResponse(res, 200, true, "Recent quotes retrieved successfully", quotes);
  } catch (error) {
    console.error("Get recent quotes error:", error);
    return sendResponse(res, 500, false, null, error.message);
  }
};

// Get revenue statistics
export const getRevenueStats = async (req, res) => {
  try {
    // Get total revenue from accepted quotes
    const revenueData = await Quote.aggregate([
      { $match: { status: 'Accepted' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalPrice" },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const acceptedQuotesCount = revenueData.length > 0 ? revenueData[0].count : 0;

    // Get pending revenue from sent and draft quotes
    const pendingData = await Quote.aggregate([
      { $match: { status: { $in: ['Sent', 'Draft'] } } },
      {
        $group: {
          _id: null,
          pendingRevenue: { $sum: "$finalPrice" },
          count: { $sum: 1 }
        }
      }
    ]);

    const pendingRevenue = pendingData.length > 0 ? pendingData[0].pendingRevenue : 0;
    const pendingQuotesCount = pendingData.length > 0 ? pendingData[0].count : 0;

    return sendResponse(res, 200, true, "Revenue stats retrieved successfully", {
      totalRevenue,
      acceptedQuotesCount,
      pendingRevenue,
      pendingQuotesCount,
      averageQuoteValue: acceptedQuotesCount > 0 ? (totalRevenue / acceptedQuotesCount).toFixed(2) : 0
    });
  } catch (error) {
    console.error("Get revenue stats error:", error);
    return sendResponse(res, 500, false, null, error.message);
  }
};
