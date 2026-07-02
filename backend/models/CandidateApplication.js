const mongoose = require('mongoose');

// ── Tiny counter model, defined here so we don't need a separate file ──────
// Reuses the mongoose connection to keep a running, atomic sequence per year.
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // e.g. "candidateApplication-2026"
    seq: { type: Number, default: 0 },
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

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

// Atomically get the next sequence number for this year — never reused,
// never duplicated, even if applications are later deleted.
candidateApplicationSchema.pre('validate', async function () {
    if (!this.applicationId) {
        const year = new Date().getFullYear();
        const counter = await Counter.findByIdAndUpdate(
            `candidateApplication-${year}`,
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.applicationId = `APP-${year}-${String(counter.seq).padStart(4, '0')}`;
    }
});

candidateApplicationSchema.index({ status: 1, appliedOn: -1 });
candidateApplicationSchema.index({ fullName: 'text', email: 'text', role: 'text' });

module.exports = mongoose.model('CandidateApplication', candidateApplicationSchema);