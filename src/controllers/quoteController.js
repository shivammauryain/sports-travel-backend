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
    const {
      leadId,
      eventId,
      packageId,
      numberOfTravelers,
      travelDate,
    } = req.body;

    const lead = await Lead.findById(leadId);
    const event = await Event.findById(eventId);
    const travelPackage = await Package.findById(packageId);

    if (!lead || !travelPackage || !event) {
      return sendResponse(
        res,
        404,
        false,
        null,
        "Lead, package, or event not found"
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
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
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

    return sendResponse(res, 201, true, {
      quoteId: quote._id,
      basePrice: pricing.basePrice,
      adjustments: pricing.adjustments,
      finalPrice: pricing.finalPrice,
      leadStatus: "Quote Sent",
    });
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};
