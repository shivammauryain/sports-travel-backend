import Package from "../models/Package.js";

// Create a new package
export const createPackage = async (req, res) => {
  try {
    const travelPackage = new Package(req.body);
    await travelPackage.save();
    res.status(201).json({ success: true, data: travelPackage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all packages
export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a package
export const updatePackage = async (req, res) => {
  try {
    const travelPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!travelPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json({ success: true, data: travelPackage });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a package
export const deletePackage = async (req, res) => {
  try {
    const travelPackage = await Package.findByIdAndDelete(req.params.id);
    if (!travelPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json({ success: true, data: travelPackage });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

