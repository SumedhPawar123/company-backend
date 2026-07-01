const mongoose = require('mongoose');

const candidateApplicationSchema = new mongoose.Schema({
    applicationId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    fullName: {
        type: String,
        required: [true, 'full name is required'],
        trim: true,
        maxlength: [100, 'full name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'phone number is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'applied role is required'],
        trim: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        default: null
    },
    resume: {
        url: { type: String, required: true },
        originalName: String
    },
    idProof: {
        url: { type: String, required: true },
        originalName: String
    },
    passportPhoto: {
        url: { type: String, required: true },
        originalName: String
    },
    status: {
        type: String,
        enum: ['New', 'Draft', 'In Review', 'Shortlisted', 'Rejected'],
        default: 'New',
        index: true
    },
    notes: {
        type: String,
        default: ''
    },
    appliedOn: {
        type: Date,
        default: Date.now
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

// Generate a human-readable applicationId before validation
// (pre('validate') so it exists before the required check runs — same
// pattern used in Job.js for jobId)
candidateApplicationSchema.pre('validate', async function () {
    if (!this.applicationId) {
        const count = await mongoose.model('CandidateApplication').countDocuments();
        const year = new Date().getFullYear();
        this.applicationId = `APP-${year}-${String(count + 1).padStart(4, '0')}`;
    }
});

candidateApplicationSchema.index({ status: 1, appliedOn: -1 });
candidateApplicationSchema.index({ fullName: 'text', email: 'text', role: 'text' });

module.exports = mongoose.model('CandidateApplication', candidateApplicationSchema);