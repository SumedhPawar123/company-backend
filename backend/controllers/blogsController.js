const Blogs = require("../models/Blogs");
const slugify = require("slugify");

// Generate unique slug
const generateUniqueSlug = async (title) => {
    let slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true
    });

    let existingBlog = await Blog.findOne({ slug });

    let counter = 1;

    while (existingBlog) {
        existingBlog = await Blog.findOne({
            slug: `${slug}-${counter}`
        });

        if (!existingBlog) {
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

        req.body.slug = await generateUniqueSlug(req.body.title);

        const blog = await Blog.create(req.body);

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



// ======================
// Get All Blogs
// ======================
exports.getAllBlogs = async (req, res) => {

    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};



// ======================
// Get Blog By Slug
// ======================
exports.getBlogBySlug = async (req, res) => {

    try {

        const blog = await Blog.findOne({
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

        const blog = await Blog.findByIdAndUpdate(
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

        const blog = await Blog.findByIdAndDelete(req.params.id);

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

        res.status(200).json({
            success: false,
            message: error.message
        });
    }

};