import express from 'express';
import { getEvents, getEventPackages } from '../controllers/eventController.js';
const router = express.Router();

router.get('/', getEvents);
router.get('/:id/packages', getEventPackages);

export default router;