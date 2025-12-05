import Event from "../models/Event";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};