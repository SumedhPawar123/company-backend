const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    jobTitle: {
        type: String,
        required: [true, 'job title is required'],
        trim: true,
        maxlength: [100, 'job title cannot exceed 100 characters']
    },
    department: {
        type: String,
        required: [true, 'job description is required'],
        trim: true,
    },
    location: {
        type: String,
        required: [true, 'job location is required'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: [true, 'job type is required'],

    },
    description: {
        type: String,
        required: [true, 'job description is required'],
        minlength: [10, 'job description must be at least 10 characters']
    },
    qualification: [{
        type: String,
        required: true
    }],
    responsibilities: [{
        type: String,
        required: true
    }],
    experienceLevel: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior', 'Lead'],
        required: [true, 'experience level is required']
    },
    salaryRange: {
        min: Number,
        max: Number,
    },
    currency: {
        type: String,
        defalt: 'INR'
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    deadline: Date,
    applicationCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


// Generate unique Job ID before saving
jobSchema.pre('save', async function () {
  if (!this.jobId) {
    const count = await mongoose.model('Job').countDocuments();
    const year = new Date().getFullYear();

    this.jobId = `JOB-${year}-${String(count + 1).padStart(3, '0')}`;
  }
});

// Index for faster queries
jobSchema.index({ isActive: 1, postedDate: -1 });
jobSchema.index({ department: 1, experienceLevel: 1 });

// Virtual for days posted
jobSchema.virtual('daysPosted').get(function () {
    return Math.floor((Date.now() - this.postedDate) / (1000 * 60 * 60 * 24));
});

// Virtual for salary display
jobSchema.virtual('salaryDisplay').get(function () {
    if (this.salaryRange?.min && this.salaryRange?.max) {
        return `${this.salaryRange.min} - ${this.salaryRange.max} ${this.currency}`;
    }
    return 'Not disclosed';
});

module.exports = mongoose.model('Job', jobSchema);