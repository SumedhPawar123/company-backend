const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'service name is required'],
        trim: true,
        maxlength: [50, 'service name cannot exceed 50 characteres']
    },
    description: {
        type: String,
        required: [true, 'service description is required'],
        trim: true,
        maxlength: [300, 'service description cannot exceed 300 characters']
    },
    category: {
        type: String,
        trim: true
    },
    keyDeliverable: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["Draft", "Published", "Archived"],
        default: "Draft"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Service", serviceSchema)