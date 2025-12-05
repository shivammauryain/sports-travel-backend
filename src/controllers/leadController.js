import Lead from "../models/Lead.js";
import LeadStatusHistory from "../models/LeadStatusHistory.js";
import { validStatusTransitions } from "../utils/validators.js";

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    const statusHistory = new LeadStatusHistory({
      leadId: lead._id,
      fromStatus: 'None',
      toStatus: 'New',
      notes: 'Lead created'
    });
    await statusHistory.save(); 
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all leads
export const getLeads = async (req, res) => {
  try {
    const {page = 1, limit = 10, status, event, month} = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (event) filter.eventId = event;  
    if (month) {
      const year = new Date().getFullYear();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.travelDate = { $gte: startDate, $lte: endDate };
    }

    const leads = (await Lead.find(filter).populate('eventId').populate('packageId').limit(limit * 1).skip((page - 1) * limit)).sort({ createdAt: -1 });
    const count = await Lead.countDocuments(filter);
    res.json({
      success: true,
      data: leads,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update lead status 
export const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
    try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    const validTransitions = validStatusTransitions[lead.status];
    if (!validTransitions.includes(status)) {
        return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${lead.status} to ${status}`
      });
    }
    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();

    await LeadStatusHistory.create({
      leadId: lead._id,
      fromStatus: oldStatus,
      toStatus: status,
      notes
    });
    
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

