const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [150, 'project title cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        trim: true,
        maxlength: [1000, 'Project Description cannot exceed 1000 characters']
    },
    thumbnail: {
        type: String,
        required: [true, "Project thumbail is required"],
        trim: true
    },
    status: {
        type: String,
        enum: ["Draft", "Published", "Archived"],
        default: "Draft"
    },
    publishDate: {
        type : Date,
        default: Date.now,
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Project", ProjectSchema)