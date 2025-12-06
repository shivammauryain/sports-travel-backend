import Event from "../models/Event.js";
import Package from "../models/Package.js";
import sendResponse from "../utils/response.js";

// Get all events
export const getEvents = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query).sort({ startDate: 1 });
    return sendResponse(res, 200, true, "Events fetched successfully", events);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) {
      return sendResponse(res, 404, false, "Event not found", null);
    }

    return sendResponse(res, 200, true, "Event fetched successfully", event);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { name, description, location, startDate, endDate, category, featured, imageUrl } = req.body;

    // Validation
    if (!name || !location || !startDate || !endDate) {
      return sendResponse(res, 400, false, "Please provide all required fields", null);
    }

    if (new Date(endDate) < new Date(startDate)) {
      return sendResponse(res, 400, false, "End date must be after start date", null);
    }

    const event = await Event.create({
      name,
      description,
      location,
      startDate,
      endDate,
      category: category || 'Other',
      featured: featured || false,
      imageUrl
    });

    return sendResponse(res, 201, true, "Event created successfully", event);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, startDate, endDate, category, featured, imageUrl } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return sendResponse(res, 404, false, "Event not found", null);
    }

    // Validate dates if both are provided
    const newStartDate = startDate || event.startDate;
    const newEndDate = endDate || event.endDate;

    if (new Date(newEndDate) < new Date(newStartDate)) {
      return sendResponse(res, 400, false, "End date must be after start date", null);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { name, description, location, startDate, endDate, category, featured, imageUrl },
      { new: true, runValidators: true }
    );

    return sendResponse(res, 200, true, "Event updated successfully", updatedEvent);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return sendResponse(res, 404, false, "Event not found", null);
    }

    // Optional: Delete associated packages
    await Package.deleteMany({ eventId: id });

    await Event.findByIdAndDelete(id);

    return sendResponse(res, 200, true, "Event deleted successfully", null);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Get packages for a specific event
export const getEventPackages = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return sendResponse(res, 404, false, "Event not found", null);
    }

    const packages = await Package.find({ eventId: id }).sort({ basePrice: 1 });
    return sendResponse(res, 200, true, "Packages fetched successfully", packages);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};
