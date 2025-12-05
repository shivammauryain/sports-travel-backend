import Event from "../models/Event.js";
import Package from "../models/Package.js";
import sendResponse from "../utils/response.js";

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });
    return sendResponse(res, 200, true, events, "Events fetched successfully");
  } catch (error) {
    return sendResponse(res, 400, false, null, error.message);
  }
};

// Get packages for a specific event
export const getEventPackages = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return sendResponse(res, 404, false, null, "Event not found");
    }

    const packages = await Package.find({ eventId: id }).sort({ basePrice: 1 });
    return sendResponse(res, 200, true, packages, "Packages fetched successfully");
  } catch (error) {
    return sendResponse(res, 400, false, null, error.message);
  }
};
