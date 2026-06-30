const express = require("express");
//==============================================
const multer     = require("multer");
const path       = require("path");
const fs         = require("fs");
//=============================================

const {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog
} = require("../controllers/blogsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

//===============================================================================
// ─── Multer storage config ────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads/blogs");
 
// Create uploads/blogs folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext      = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext)
            .replace(/\s+/g, "-")
            .toLowerCase();
        cb(null, `${basename}-${Date.now()}${ext}`);
    },
});
 
// const fileFilter = (req, file, cb) => {
//     console.log("Original Name:", file.originalname);
//     console.log("Mime Type:", file.mimetype);
//     console.log("Extension:", path.extname(file.originalname));
//     const allowedExt = /\.(jpeg|jpg|png|webp|gif|jfif)$/i;
//     const allowedMime = /^image\/(jpeg|png|webp|gif)$/i;

//     const extOk  = allowedExt.test(path.extname(file.originalname));
//     const mimeOk = allowedMime.test(file.mimetype);
//     if (extOk && mimeOk) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
//     }
// };
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};
 
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

//===============================================

//Routes ------------------------------

router.get("/", getAllBlogs);
// Example:
// /api/blogs/getting-started-with-docker
router.get("/:slug", getBlogBySlug);


/// Protected — upload.single("thumbnail") parses multipart/form-data
router.post(  "/",    protect, adminOnly, upload.single("thumbnail"), createBlog);
router.put(   "/:id", protect, adminOnly, upload.single("thumbnail"), updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;