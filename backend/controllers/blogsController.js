const Blogs = require("../models/Blogs");
const slugify = require("slugify");

// Generate unique slug
const generateUniqueSlug = async (title) => {
    let slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true
    });

    //-------------------------------------------------
    // use Blogs instead of Blog
    let existing = await Blogs.findOne({ slug });  
    // let existingBlog = await Blog.findOne({ slug });
    //-------------------------------------------------

    let counter = 1;

    while (existing) {
        existing = await Blogs.findOne({
            slug: `${slug}-${counter}`
        });

        if (!existing) {
            slug = `${slug}-${counter}`;
            break;
        }

        counter++;
    }

    return slug;
};



// ======================
// Create Blog
// ======================
exports.createBlog = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        req.body.slug = await generateUniqueSlug(req.body.title);

        // If thumbnail uploaded via multer, set the path/url
        // multer puts the file in req.file — store as a URL path
        if (req.file) {
            req.body.thumbnail = `/uploads/blogs/${req.file.filename}`;
        }

        //===============================================
        //uses Blogs instead of Blog
        //const blog = await Blog.create(req.body);
        const blog   = await Blogs.create(req.body);
        //===============================================

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


 
// ─── Get All Blogs (with search + pagination) ────────────────────────────────
exports.getAllBlogs = async (req, res) => {
    try {
        const { search, status, category, page = 1, limit = 6 } = req.query;
 
        const query = {};
 
        if (search) {
            query.$or = [
                { title:    { $regex: search, $options: "i" } },
                { author:   { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
 
        if (status)   query.status   = status;
        if (category) query.category = category;
 
        const skip  = (Number(page) - 1) * Number(limit);
        const total = await Blogs.countDocuments(query);
 
        const blogs = await Blogs.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
 
        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
            pagination: {
                total,
                page:       Number(page),
                limit:      Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// Get Blog By Slug
// ======================
exports.getBlogBySlug = async (req, res) => {

    try {

        const blog = await Blogs.findOne({
            slug: req.params.slug
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            data: blog
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};



// ======================
// Update Blog
// ======================
exports.updateBlog = async (req, res) => {

    try {

        if (req.body.title) {
            req.body.slug = await generateUniqueSlug(req.body.title);
        }

        //=============================================================
        // Add multer/file handling at all.
        if (req.file) {
            req.body.thumbnail = `/uploads/blogs/${req.file.filename}`;
        }
 
        //=================================================================

        const blog = await Blogs.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};



// ======================
// Delete Blog
// ======================
exports.deleteBlog = async (req, res) => {

    try {

        const blog = await Blogs.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};