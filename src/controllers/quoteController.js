import Quote from "../models/Quote.js";
import Lead from "../models/Lead.js";
import Package from "../models/Package.js";
import Event from "../models/Event.js";
import LeadStatusHistory from "../models/LeadStatusHistory.js";
import PricingCalculator from "../utils/pricing.js";
import EmailService from "../utils/email.js";
import sendResponse from "../utils/response.js";

// Generate a quote for a lead
export const generateQuote = async (req, res) => {
  try {
    let {
      leadId,
      eventId,
      packageId,
      numberOfTravelers,
      travelDate,
      validUntil,
      status,
      notes
    } = req.body;

    // Fetch the lead first
    const lead = await Lead.findById(leadId).populate('eventId packageId');
    if (!lead) {
      return sendResponse(res, 404, false, null, "Lead not found");
    }

    // Extract data from lead if not provided
    if (!eventId && lead.eventId) {
      eventId = lead.eventId._id || lead.eventId;
    }
    if (!packageId && lead.packageId) {
      packageId = lead.packageId._id || lead.packageId;
    }
    if (!numberOfTravelers && lead.numberOfTravelers) {
      numberOfTravelers = lead.numberOfTravelers;
    }
    if (!travelDate && lead.travelDate) {
      travelDate = lead.travelDate;
    }

    // Validate we have all required data
    if (!eventId || !packageId || !numberOfTravelers || !travelDate) {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Missing required data: eventId, packageId, numberOfTravelers, and travelDate must be provided or exist in the lead"
      );
    }

    const event = await Event.findById(eventId);
    const travelPackage = await Package.findById(packageId);

    if (!travelPackage || !event) {
      return sendResponse(
        res,
        404,
        false,
        null,
        "Package or event not found"
      );
    }

    // Calculate pricing
    const calculator = new PricingCalculator(
      travelPackage,
      travelDate,
      event.startDate,
      numberOfTravelers
    );

    const pricing = calculator.calculateFinalPrice();

    const quote = await Quote.create({
      leadId,
      eventId: event._id,
      packageId,
      basePrice: pricing.basePrice,
      adjustments: pricing.adjustments,
      finalPrice: pricing.finalPrice,
      numberOfTravelers,
      travelDate,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      status: status || "Draft",
      notes: notes || ''
    });

    // Send quote email to lead
    await EmailService.sendQuoteEmail(lead, quote, event, travelPackage);

    const oldStatus = lead.status;
    lead.status = "Quote Sent";
    lead.packageId = packageId;
    await lead.save();

    await LeadStatusHistory.create({
      leadId: lead._id,
      fromStatus: oldStatus,
      toStatus: "Quote Sent",
      notes: `Quote generated: ${quote._id}`,
    });

    return sendResponse(res, 201, true, "Quote generated successfully", {
      quoteId: quote._id,
      basePrice: pricing.basePrice,
      adjustments: pricing.adjustments,
      finalPrice: pricing.finalPrice,
      leadStatus: "Quote Sent",
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Get all quotes with pagination and filters
export const getQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, leadId, eventId } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (leadId) query.leadId = leadId;
    if (eventId) query.eventId = eventId;

    const skip = (Number(page) - 1) * Number(limit);

    const [quotes, total] = await Promise.all([
      Quote.find(query)
        .populate("leadId", "name email phone")
        .populate("eventId", "name startDate endDate")
        .populate("packageId", "name tier price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Quote.countDocuments(query),
    ]);

    return sendResponse(res, 200, true, "Quotes retrieved successfully", {
      quotes,
      pagination: {
        currentPage: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
        limit: Number(limit),
      },
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Get quote by ID
export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id)
      .populate("leadId", "name email phone numberOfTravelers")
      .populate("eventId", "name startDate endDate location")
      .populate("packageId", "name tier price features");

    if (!quote) {
      return sendResponse(res, 404, false, "Quote not found");
    }

    return sendResponse(res, 200, true, "Quote retrieved successfully", quote);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Update quote
export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const quote = await Quote.findById(id);
    if (!quote) {
      return sendResponse(res, 404, false, "Quote not found");
    }

    // If status is being updated to "Sent", send email
    if (updates.status === "Sent" && quote.status !== "Sent") {
      const lead = await Lead.findById(quote.leadId);
      const event = await Event.findById(quote.eventId);
      const travelPackage = await Package.findById(quote.packageId);
      
      if (lead && event && travelPackage) {
        await EmailService.sendQuoteEmail(lead, quote, event, travelPackage);
        
        // Update lead status
        const oldStatus = lead.status;
        lead.status = "Quote Sent";
        await lead.save();

        await LeadStatusHistory.create({
          leadId: lead._id,
          fromStatus: oldStatus,
          toStatus: "Quote Sent",
          notes: `Quote sent: ${quote._id}`,
        });
      }
    }

    // If status is "Accepted", update lead status
    if (updates.status === "Accepted") {
      const lead = await Lead.findById(quote.leadId);
      if (lead) {
        const oldStatus = lead.status;
        lead.status = "Closed Won";
        await lead.save();

        await LeadStatusHistory.create({
          leadId: lead._id,
          fromStatus: oldStatus,
          toStatus: "Closed Won",
          notes: `Quote accepted: ${quote._id}`,
        });
      }
    }

    // If status is "Rejected", update lead status
    if (updates.status === "Rejected") {
      const lead = await Lead.findById(quote.leadId);
      if (lead && lead.status !== "Closed Won") {
        const oldStatus = lead.status;
        lead.status = "Closed Lost";
        await lead.save();

        await LeadStatusHistory.create({
          leadId: lead._id,
          fromStatus: oldStatus,
          toStatus: "Closed Lost",
          notes: `Quote rejected: ${quote._id}`,
        });
      }
    }

    Object.assign(quote, updates);
    await quote.save();

    const updatedQuote = await Quote.findById(id)
      .populate("leadId", "name email phone")
      .populate("eventId", "name startDate endDate")
      .populate("packageId", "name tier price");

    return sendResponse(res, 200, true, "Quote updated successfully", updatedQuote);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Delete quote
export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findByIdAndDelete(id);

    if (!quote) {
      return sendResponse(res, 404, false, "Quote not found");
    }

    return sendResponse(res, 200, true, "Quote deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
