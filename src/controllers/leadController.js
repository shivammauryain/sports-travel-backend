import Lead from "../models/Lead.js";
import LeadStatusHistory from "../models/LeadStatusHistory.js";
import sendResponse from "../utils/response.js";
import { validStatusTransitions, validateLead } from "../utils/validators.js";

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const validation = validateLead(req.body);
    if (!validation.isValid) {
      return sendResponse(res, 400, false, null, validation.errors);
    }

    const lead = new Lead(req.body);
    await lead.save();

    await LeadStatusHistory.create({
      leadId: lead._id,
      fromStatus: "New",
      toStatus: "New",
      notes: "Lead created",
    });

    return sendResponse(res, 201, true, lead, "Lead created successfully");
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};

// Get all leads with filters + pagination
export const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, event, month } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (event) filter.eventId = event;

    if (month) {
      const year = new Date().getFullYear();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.travelDate = { $gte: startDate, $lte: endDate };
    }

    const leads = await Lead.find(filter)
      .populate("eventId")
      .populate("packageId")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const count = await Lead.countDocuments(filter);

    return sendResponse(res, 200, true, {
      leads,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};

// Update lead status
export const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes = "" } = req.body;

  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return sendResponse(res, 404, false, null, "Lead not found");
    }

    const validTransitions = validStatusTransitions[lead.status] || [];

    if (!validTransitions.includes(status)) {
      return sendResponse(
        res,
        400,
        false,
        null,
        `Invalid status transition from ${lead.status} to ${status}`
      );
    }

    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();

    await LeadStatusHistory.create({
      leadId: lead._id,
      fromStatus: oldStatus,
      toStatus: status,
      notes,
    });

    return sendResponse(res, 200, true, lead, "Lead status updated");
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};
