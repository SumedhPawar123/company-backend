const express = require("express");
const router = express.Router();

const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public
router.get("/", getAllServices);

//admin
router.post("/", protect, adminOnly, createService);
router.get("/:id",protect, adminOnly, getServiceById);
router.put("/:id",protect, adminOnly, updateService);
router.delete("/:id",protect, adminOnly, deleteService);

module.exports = router;