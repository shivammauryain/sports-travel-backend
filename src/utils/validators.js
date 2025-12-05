
// Valid status transitions
export const validStatusTransitions = {
  New: ["Contacted"],
  Contacted: ["Quote Sent", "Closed Lost"],
  "Quote Sent": ["Interested", "Closed Lost"],
  Interested: ["Closed Won", "Closed Lost"],
  "Closed Won": [],
  "Closed Lost": [],
};

// Check if status transition is valid
export const canTransitionStatus = (fromStatus, toStatus) => {
  const allowed = validStatusTransitions[fromStatus] || [];
  return allowed.includes(toStatus);
};

// Validate lead data 
export const validateLead = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.phone || !/^\+?[\d\s-()]+$/.test(data.phone)) {
    errors.push("Valid phone number is required");
  }

  if (
    !data.numberOfTravelers ||
    Number.isNaN(Number(data.numberOfTravelers)) ||
    Number(data.numberOfTravelers) < 1
  ) {
    errors.push("Number of travelers must be at least 1");
  }

  if (!data.travelDate || new Date(data.travelDate) < new Date()) {
    errors.push("Travel date must be in the future");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate quote data
export const validateQuote = (data) => {
  const errors = [];

  if (!data.leadId) errors.push("Lead ID is required");
  if (!data.packageId) errors.push("Package ID is required");

  if (
    !data.numberOfTravelers ||
    Number.isNaN(Number(data.numberOfTravelers)) ||
    Number(data.numberOfTravelers) < 1
  ) {
    errors.push("Number of travelers must be at least 1");
  }

  if (!data.travelDate) {
    errors.push("Travel date is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
