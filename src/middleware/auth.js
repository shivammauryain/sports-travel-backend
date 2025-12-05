import env from "../config/env.js";

const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key required",
    });
  }

  if (!env.ADMIN_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error: API key not configured",
    });
  }

  if (apiKey !== env.ADMIN_API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
};

export default authenticate;
