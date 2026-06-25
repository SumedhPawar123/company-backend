const express = require('express')
const router = express.Router()

const { protect, adminOnly } = require("../middleware/authMiddleware")
const { login } = require('../controllers/adminController')

// login
router.post("/login", login)
router.get("/", (req,res)=> {
    res.send("Getting to much load")
})

module.exports = router;