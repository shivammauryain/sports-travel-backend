import express from "express";
import {
  getDashboardStats,
  getRecentLeads,
  getRecentQuotes,
  getRevenueStats
} from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

// Get dashboard statistics
router.get("/stats", getDashboardStats);
router.get("/recent-leads", getRecentLeads);
router.get("/recent-quotes", getRecentQuotes);
router.get("/revenue", getRevenueStats);

export default router;
