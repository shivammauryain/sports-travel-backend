import Package from "../models/Package.js";
import Event from "../models/Event.js";
import sendResponse from "../utils/response.js";

// Get all packages
export const getPackages = async (req, res) => {
  try {
    const { eventId, tier, search } = req.query;
    let query = {};

    if (eventId) {
      query.eventId = eventId;
    }

    if (tier && tier !== 'all') {
      query.tier = tier;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const packages = await Package.find(query)
      .populate('eventId', 'name location startDate endDate')
      .sort({ basePrice: -1 });

    return sendResponse(res, 200, true, "Packages fetched successfully", packages);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Get single package by ID
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const package_ = await Package.findById(id).populate('eventId');
    
    if (!package_) {
      return sendResponse(res, 404, false, "Package not found", null);
    }

    return sendResponse(res, 200, true, "Package fetched successfully", package_);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Create new package
export const createPackage = async (req, res) => {
  try {
    const { eventId, name, description, basePrice, features, tier, maxTravelers, inclusions, duration, accommodationType } = req.body;

    // Validation
    if (!name || !basePrice || !maxTravelers || !eventId) {
      return sendResponse(res, 400, false, "Please provide all required fields (name, basePrice, maxTravelers, eventId)", null);
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return sendResponse(res, 404, false, "Event not found", null);
    }

    // Check if this event already has 4 packages (max limit)
    const existingPackagesCount = await Package.countDocuments({ eventId });
    if (existingPackagesCount >= 4) {
      return sendResponse(res, 400, false, "Maximum 4 packages allowed per event (one per tier)", null);
    }

    // Check if this tier already exists for this event
    const existingPackage = await Package.findOne({ eventId, tier: tier || 'Standard' });
    if (existingPackage) {
      return sendResponse(res, 400, false, `A ${tier || 'Standard'} package already exists for this event`, null);
    }

    const package_ = await Package.create({
      eventId,
      name,
      description,
      basePrice,
      features: features || [],
      inclusions: inclusions || [],
      tier: tier || 'Standard',
      maxTravelers,
      duration,
      accommodationType
    });

    const populatedPackage = await Package.findById(package_._id).populate('eventId');

    return sendResponse(res, 201, true, "Package created successfully", populatedPackage);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Update package
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventId, name, description, basePrice, features, tier, maxTravelers, inclusions, duration, accommodationType } = req.body;

    const package_ = await Package.findById(id);
    if (!package_) {
      return sendResponse(res, 404, false, "Package not found", null);
    }

    // If tier is being changed, check if new tier already exists for this event
    if (tier && tier !== package_.tier) {
      const existingPackage = await Package.findOne({ 
        eventId: eventId || package_.eventId, 
        tier,
        _id: { $ne: id }
      });
      if (existingPackage) {
        return sendResponse(res, 400, false, `A ${tier} package already exists for this event`, null);
      }
    }

    // Verify event exists if eventId is being updated
    if (eventId && eventId !== package_.eventId.toString()) {
      const event = await Event.findById(eventId);
      if (!event) {
        return sendResponse(res, 404, false, "Event not found", null);
      }
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { eventId, name, description, basePrice, features, tier, maxTravelers, inclusions, duration, accommodationType },
      { new: true, runValidators: true }
    ).populate('eventId');

    return sendResponse(res, 200, true, "Package updated successfully", updatedPackage);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

// Delete package
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const package_ = await Package.findById(id);
    if (!package_) {
      return sendResponse(res, 404, false, "Package not found", null);
    }

    await Package.findByIdAndDelete(id);

    return sendResponse(res, 200, true, "Package deleted successfully", null);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};
