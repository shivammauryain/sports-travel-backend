import Lead from "../models/Lead.js";
import LeadStatusHistory from "../models/LeadStatusHistory.js";
import sendResponse from "../utils/response.js";
import { validateLead } from "../utils/validators.js";

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

    return sendResponse(res, 200, true, "Leads retrieved successfully", {
      leads,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Get single lead by ID
export const getLeadById = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findById(id)
      .populate("eventId")
      .populate("packageId");

    if (!lead) {
      return sendResponse(res, 404, false, null, "Lead not found");
    }

    return sendResponse(res, 200, true, lead, "Lead retrieved successfully");
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};
// Delete lead by ID
export const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return sendResponse(res, 404, false, null, "Lead not found");
    }
    
    // Also delete status history
    await LeadStatusHistory.deleteMany({ leadId: id });
    
    return sendResponse(res, 200, true, null, "Lead deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};

// Update lead
export const updateLead = async (req, res) => {
  const { id } = req.params;
  try {
    const oldLead = await Lead.findById(id);
    if (!oldLead) {
      return sendResponse(res, 404, false, null, "Lead not found");
    }

    const validation = validateLead(req.body);
    if (!validation.isValid) {
      return sendResponse(res, 400, false, null, validation.errors);
    }

    const lead = await Lead.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate('eventId').populate('packageId');

    // Track status change if status was updated
    if (req.body.status && req.body.status !== oldLead.status) {
      await LeadStatusHistory.create({
        leadId: lead._id,
        fromStatus: oldLead.status,
        toStatus: req.body.status,
        notes: req.body.statusNotes || `Status updated to ${req.body.status}`,
      });
    }

    return sendResponse(res, 200, true, lead, "Lead updated successfully");
  } catch (error) {
    return sendResponse(res, 500, false, null, error.message);
  }
};

// Get lead status history
export const getLeadStatusHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return sendResponse(res, 404, false, "Lead not found", null);
    }

    const history = await LeadStatusHistory.find({ leadId: id })
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Status history retrieved", {
      lead: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        currentStatus: lead.status
      },
      history
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};
