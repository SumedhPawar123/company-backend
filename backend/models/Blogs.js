const mongoose = require('mongoose')

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        maxlength: [200, "title cannot exceed 200 characters"],
        index: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        sparse: true
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
        minlength: [50, 'blog content must be at least 50 characters']
    },
    author: {
        type: String,
        required: [true, 'Author name is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['DevOps', 'WebPerformance', 'Automation', 'Cloud', 'Security', 'Architecture', 'Other']
    },
    thumbnail: {
        type: String,
        required: [true, 'blogs cover image is required']
    },
    readingTime: {
        type: Number,
        default: function () {
            // Estimate reading time (200 words per minute)
            return Math.ceil(this.content.split(' ').length / 200);
        }
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Blogs", blogsSchema)