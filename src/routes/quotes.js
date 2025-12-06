import express from "express";
import { generateQuote, getQuotes, getQuoteById, updateQuote, deleteQuote } from "../controllers/quoteController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", authenticate, generateQuote);
router.get("/", authenticate, getQuotes);
router.get("/:id", authenticate, getQuoteById);
router.patch("/:id", authenticate, updateQuote);
router.delete("/:id", authenticate, deleteQuote);

export default router;
