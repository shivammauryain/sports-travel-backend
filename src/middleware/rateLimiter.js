import rateLimit from "express-rate-limit";
import sendResponse from "../utils/response.js";

// General rate limiter for all routes
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per window per IP
  standardHeaders: true,    
  legacyHeaders: false,     
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  handler: (req, res, _next, options) => {
    return sendResponse(res, 429, false, null, options.message.message);
  }
});

// Stricter rate limiter for lead creation (bonus requirement)
export const leadCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // Only 5 lead submissions per 15 minutes
  standardHeaders: true,    
  legacyHeaders: false,     
  skipSuccessfulRequests: false,
  message: {
    success: false,
    message: "Too many lead submissions. Please try again in 15 minutes.",
  },
  handler: (req, res, _next, options) => {
    return sendResponse(res, 429, false, null, options.message.message);
  }
});

export default rateLimiter;
