const FAQ = require("../models/FAQ");

// @desc    Get all FAQs (with search + pagination)
// @route   GET /api/faqs
// @access  Public
const getAllFAQs = async (req, res) => {
  try {
    const { search, status, category, page = 1, limit = 7 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer:   { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (status)   query.status   = status;
    if (category) query.category = category;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await FAQ.countDocuments(query);

    const faqs = await FAQ.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: faqs,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single FAQ
// @route   GET /api/faqs/:id
// @access  Public
const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private (Admin)
const createFAQ = async (req, res) => {
  try {
    const { question, answer, category, displayOrder, status } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ success: false, message: "Question and Answer are required" });
    }

    const faq = await FAQ.create({ question, answer, category, displayOrder, status });

    res.status(201).json({ success: true, data: faq, message: "FAQ created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private (Admin)
const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new:          true,
      runValidators: true,
    });

    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    res.status(200).json({ success: true, data: faq, message: "FAQ updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private (Admin)
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    res.status(200).json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle FAQ status (Active ↔ Inactive)
// @route   PATCH /api/faqs/:id/toggle-status
// @access  Private (Admin)
const toggleFAQStatus = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    faq.status = faq.status === "Active" ? "Inactive" : "Active";
    await faq.save();

    res.status(200).json({ success: true, data: faq, message: `FAQ status updated to ${faq.status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ, toggleFAQStatus };