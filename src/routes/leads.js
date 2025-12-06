import express from 'express';
import authenticate from '../middleware/auth.js';
import { leadCreationLimiter } from '../middleware/rateLimiter.js';
import { createLead, getLeads, getLeadById, getLeadStatusHistory, deleteLead, updateLead } from '../controllers/leadController.js';
const router = express.Router();

router.post('/', leadCreationLimiter, createLead);
router.get('/', authenticate, getLeads);
router.get('/:id', authenticate, getLeadById);
router.patch('/:id', authenticate, updateLead);
router.delete('/:id', authenticate, deleteLead);
router.get('/:id/history', authenticate, getLeadStatusHistory);

export default router;