import express from 'express';
import authenticate from '../middleware/auth.js';
import { leadCreationLimiter } from '../middleware/rateLimiter.js';
import { createLead, getLeads, updateLeadStatus } from '../controllers/leadController.js';
const router = express.Router();

// Public endpoints - no auth required for frontend integration
router.post('/', leadCreationLimiter, createLead);
router.get('/', getLeads);

// Admin only endpoint
router.patch('/:id/status', authenticate, updateLeadStatus);

export default router;