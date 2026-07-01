const express = require("express");
const {
  submitApplication,
  getAllApplications,
  getApplicationStats,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/CandidateController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadCandidateDocs } = require("../middleware/UploadMiddleware");

const router = express.Router();

// ── Public: candidate submits the Career page form ─────────────────────────
router.post("/apply", uploadCandidateDocs, submitApplication);

// ── Admin (protected) ───────────────────────────────────────────────────────
router.get("/", protect, adminOnly, getAllApplications);
router.get("/stats", protect, adminOnly, getApplicationStats);
router.get("/:id", protect, adminOnly, getApplicationById);
router.put("/:id", protect, adminOnly, updateApplicationStatus);
router.delete("/:id", protect, adminOnly, deleteApplication);

module.exports = router;