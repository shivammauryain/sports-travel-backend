import express from 'express';
const router = express.Router();
const { generateQuote } = require('../controllers/quoteController');

router.post('/', generateQuote);

export default router;