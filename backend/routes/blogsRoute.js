const express = require("express");

const {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog
} = require("../controllers/blogsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",protect, adminOnly, createBlog);

router.get("/", getAllBlogs);

// Example:
// /api/blogs/getting-started-with-docker
router.get("/:slug", getBlogBySlug);

router.put("/:id", protect, adminOnly, updateBlog);

router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;