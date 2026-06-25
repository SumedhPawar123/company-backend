const express = require("express");

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  changeProjectStatus,
  getPublishedProjects,
} = require("../controllers/projectController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


const router = express.Router();

// Public Routes
router.get("/", getAllProjects);
router.get("/published", getPublishedProjects);
router.get("/:id", getProjectById);

// Admin Routes
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.patch("/:id/status", protect, adminOnly, changeProjectStatus);
router.delete("/:id", protect, adminOnly, deleteProject);

module.exports = router;