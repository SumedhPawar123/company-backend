const express = require('express')
const router = express.Router()

const { protect, adminOnly } = require("../middleware/authMiddleware")
const { login, getMe } = require('../controllers/adminController')

// login
router.post("/login", login)

// protected — verify session / get current admin
router.get("/me", protect, getMe)

module.exports = router;