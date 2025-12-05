import express from 'express';
const router = express.Router();
const { createLead, getLeads, updateLeadStatus } = require('../controllers/leadController');

router.post('/', createLead);
router.get('/', getLeads);
router.patch('/:id/status', updateLeadStatus);

export default router;