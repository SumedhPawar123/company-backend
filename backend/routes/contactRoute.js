const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/authMiddleware");



// Public Route
router.post("/", createContact);


// Admin Routes
router.get("/", protect, adminOnly, getAllContacts);

router.get("/:id",protect, adminOnly, getContactById);

router.delete("/:id",protect, adminOnly, deleteContact);

module.exports = router;