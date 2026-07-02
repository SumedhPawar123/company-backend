const Config = require('../models/Config');

// Get public config (Public - limited data)
exports.getPublicConfig = async (req, res) => {
  try {
    const config = await Config.findOne();

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    // Return only public information
    const publicConfig = {
      companyName: config.companyName,
      companyLogo: config.companyLogo,
      companyEmail: config.companyEmail,
      companyPhone: config.companyPhone,
      companyAddress: config.companyAddress,
      website: config.website,
      socialLinks: config.socialLinks,
      businessHours: config.businessHours,
      trustBadges: config.trustBadges,
      certifications: config.certifications,
      seoConfig: config.seoConfig
    };

    res.json({
      success: true,
      data: publicConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get full config (Admin only)
exports.getFullConfig = async (req, res) => {
  try {
    const config = await Config.findOne()
      .populate('updatedBy', 'name email');

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Update full config (Admin only)
exports.updateConfig = async (req, res) => {
  try {
    const data = req.body;

    let config = await Config.findOne();

    if (!config) {
      config = new Config(data);
    } else {
      Object.assign(config, data);
    }

    config.updatedBy = req.admin._id;
    config.updatedAt = new Date();

    await config.save();

    res.status(200).json({
      success: true,
      message: 'Configuration updated successfully',
      data: config
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update company basic info
exports.updateCompanyInfo = async (req, res) => {
  try {
    const { companyName, companyEmail, companyPhone, companyAddress, website } = req.body;

    let config = await Config.findOne();

    if (!config) {
      config = new Config();
    }

    if (companyName) config.companyName = companyName;
    if (companyEmail) config.companyEmail = companyEmail;
    if (companyPhone) config.companyPhone = companyPhone;
    if (companyAddress) config.companyAddress = companyAddress;
    if (website) config.website = website;

    config.updatedBy = req.admin._id;
    config.updatedAt = Date.now();

    await config.save();

    res.json({
      success: true,
      message: 'Company information updated',
      data: config
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update registration IDs
exports.updateRegistrationIds = async (req, res) => {
  try {
    const { cin, gstin, pan } = req.body;

    let config = await Config.findOne();

    if (!config) {
      config = new Config();
    }

    config.registrationIds = { cin, gstin, pan };
    config.updatedBy = req.admin._id;
    config.updatedAt = Date.now();

    await config.save();

    res.json({
      success: true,
      message: 'Registration IDs updated',
      data: config.registrationIds
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update social links
exports.updateSocialLinks = async (req, res) => {
  try {
    const socialLinks = req.body;

    let config = await Config.findOne();

    if (!config) {
      config = new Config();
    }

    config.socialLinks = { ...config.socialLinks, ...socialLinks };
    config.updatedBy = req.admin._id;
    config.updatedAt = Date.now();

    await config.save();

    res.json({
      success: true,
      message: 'Social links updated',
      data: config.socialLinks
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update business hours
exports.updateBusinessHours = async (req, res) => {
  try {
    const businessHours = req.body;

    let config = await Config.findOne();

    if (!config) {
      config = new Config();
    }

    config.businessHours = businessHours;
    config.updatedBy = req.admin._id;
    config.updatedAt = Date.now();

    await config.save();

    res.json({
      success: true,
      message: 'Business hours updated',
      data: config.businessHours
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add trust badge
exports.addTrustBadge = async (req, res) => {
  try {
    const { badge } = req.body;

    if (!badge) {
      return res.status(400).json({
        success: false,
        message: 'Badge URL is required'
      });
    }

    let config = await Config.findOne();

    if (!config) {
      config = new Config();
    }

    if (!config.trustBadges.includes(badge)) {
      config.trustBadges.push(badge);
    }

    config.updatedBy = req.admin._id;
    config.updatedAt = Date.now();

    await config.save();

    res.json({
      success: true,
      message: 'Trust badge added',
      data: config.trustBadges
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Remove trust badge
exports.removeTrustBadge = async (req, res) => {
  try {
    const { badge } = req.body;

    const config = await Config.findOne();

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    config.trustBadges = config.trustBadges.filter(b => b !== badge);
    config.updatedBy = req.admin._id;
    config.updatedAt = Date.now();

    await config.save();

    res.json({
      success: true,
      message: 'Trust badge removed',
      data: config.trustBadges
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update SEO configuration
exports.updateSEO = async (req, res) => {
  try {
    const { metaTitle, metaDescription, metaKeywords, ogImage } = req.body;

    let config = await Config.findOne();

    if (!config) {
      config = new Config();
    }

    config.seoConfig = {
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage
    };

    config.updatedBy = req.admin._id;
    config.updatedAt = Date.now();

    await config.save();

    res.json({
      success: true,
      message: 'SEO configuration updated',
      data: config.seoConfig
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};