import express from 'express';
import { getEvents, createEvent, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.get(`/:id`, getEventById);
router.patch(`/:id`, updateEvent);
router.delete(`/:id`, deleteEvent);

export default router;