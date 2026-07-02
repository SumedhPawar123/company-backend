const express = require('express');
const router = express.Router();
// const configController = require('../controllers/configController');
// const authMiddleware = require('../middleware/authMiddleware');
// const { validate, schemas } = require('../middleware/validation');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getFullConfig, getPublicConfig, updateConfig, updateCompanyInfo, updateRegistrationIds, updateSocialLinks, updateBusinessHours, addTrustBadge, removeTrustBadge, updateSEO } = require('../controllers/configController');

// Public route
router.get('/public', getPublicConfig);

// Admin routes
router.get('/',
  protect,
  adminOnly,
  getFullConfig
);

router.put('/',
  protect,
  adminOnly,
  // validate(schemas.updateConfig),
  updateConfig
);

router.patch('/company-info',
  protect,
  adminOnly,
  updateCompanyInfo
);

router.patch('/registration-ids',
  protect,
  adminOnly,
  updateRegistrationIds
);

router.patch('/social-links',
  protect,
  adminOnly,
  updateSocialLinks
);

router.patch('/business-hours',
  protect,
  adminOnly,
  updateBusinessHours
);

router.post('/trust-badge/add',
  protect,
  adminOnly,
  addTrustBadge
);

router.post('/trust-badge/remove',
  protect,
  adminOnly,
  removeTrustBadge
);

router.patch('/seo',
  protect,
  adminOnly,
  updateSEO
);

module.exports = router;