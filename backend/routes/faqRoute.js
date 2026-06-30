const express = require("express");
const router  = express.Router();

const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
} = require("../controllers/faqController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/",     getAllFAQs);
router.get("/:id",  getFAQById);

// Protected (admin) routes
router.post("/",               protect, createFAQ);
router.put("/:id",             protect, updateFAQ);
router.delete("/:id",          protect, deleteFAQ);
router.patch("/:id/toggle-status", protect, toggleFAQStatus);

module.exports = router;