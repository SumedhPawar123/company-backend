const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Indoria Technologies Private Limited'
  },
  companyLogo: String,
  companyEmail: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  companyPhone: String,
  companyAddress: String,
  companyDescription: String,
  website: String,
  registrationIds: {
    cin: String,
    gstin: String,
    pan: String
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    whatsapp: String,
    instagram: String
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  trustBadges: [String],
  certifications: [String],
  seoConfig: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogImage: String
  },
  emailConfig: {
    supportEmail: String,
    salesEmail: String,
    careersEmail: String
  },
  analyticsConfig: {
    googleAnalyticsId: String,
    hotjarId: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  strict: false // Allow additional fields
});

// Only one config document should exist
configSchema.pre('save', async function () {
  if (this.isNew) {
    const existingConfig = await this.constructor.findOne();

    if (existingConfig) {
      const error = new Error('Only one configuration document is allowed');
      error.statusCode = 400;
      throw error;
    }
  }

  this.updatedAt = new Date();
});

module.exports = mongoose.model('Config', configSchema);