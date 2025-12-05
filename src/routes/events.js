import express from 'express';
const router = express.Router();
import { createEvent, getEvents, updateEvent, deleteEvent } from '../controllers/eventController';

router.post('/', createEvent);
router.get('/', getEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;