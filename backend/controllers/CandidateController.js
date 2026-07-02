const CandidateApplication = require("../models/Candidateapplication");
const Job = require("../models/Job");

// ── Public: Submit application from the Career page ────────────────────────
exports.submitApplication = async (req, res, next) => {
  try {
    const { fullName, email, phone, role, jobId } = req.body;

    if (!fullName || !email || !phone || !role) {
      const error = new Error("Full name, email, phone, and role are required.");
      error.status = 400;
      return next(error);
    }

    // Exactly 10 digits, India, no country code, no spaces/dashes
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      const error = new Error("Please enter a valid 10-digit phone number.");
      error.status = 400;
      return next(error);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const error = new Error("Please enter a valid email address.");
      error.status = 400;
      return next(error);
    }

    if (!req.files || !req.files.resume || !req.files.idProof || !req.files.passportPhoto) {
      const error = new Error("Resume, ID proof, and passport photo are all required.");
      error.status = 400;
      return next(error);
    }

    const buildFile = (fileArr) => ({
      url: `/uploads/candidates/${fileArr[0].filename}`,
      originalName: fileArr[0].originalname,
    });

    let jobRef = null;
    if (jobId) {
      const job = await Job.findById(jobId).select("_id");
      if (job) jobRef = job._id;
    }

    const application = await CandidateApplication.create({
      fullName,
      email,
      phone,
      role,
      job: jobRef,
      resume: buildFile(req.files.resume),
      idProof: buildFile(req.files.idProof),
      passportPhoto: buildFile(req.files.passportPhoto),
    });

    // Keep the job's applicationCount in sync, same field Job.js already defines
    if (jobRef) {
      await Job.findByIdAndUpdate(jobRef, { $inc: { applicationCount: 1 } });
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.status = 400;
    }
    next(error);
  }
};

// ── Admin: List all applications (search + filter + pagination) ───────────
exports.getAllApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { applicationId: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);

    const applications = await CandidateApplication.find(filter)
      .sort({ appliedOn: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await CandidateApplication.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total,
        pages: Math.max(Math.ceil(total / limitNum), 1),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Stats for the summary cards ─────────────────────────────────────
exports.getApplicationStats = async (req, res, next) => {
  try {
    const totalApplication = await CandidateApplication.countDocuments();
    const newApplications = await CandidateApplication.countDocuments({ status: "New" });
    const inReview = await CandidateApplication.countDocuments({ status: "In Review" });
    const shortlisted = await CandidateApplication.countDocuments({ status: "Shortlisted" });
    const rejected = await CandidateApplication.countDocuments({ status: "Rejected" });

    res.status(200).json({
      success: true,
      data: {
        totalApplication,
        newApplications,
        inReview,
        shortlisted,
        rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Get single application ──────────────────────────────────────────
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await CandidateApplication.findById(req.params.id);

    if (!application) {
      const error = new Error("Application not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Update status / notes ───────────────────────────────────────────
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const allowedStatuses = ["New", "Draft", "In Review", "Shortlisted", "Rejected"];

    const application = await CandidateApplication.findById(req.params.id);

    if (!application) {
      const error = new Error("Application not found");
      error.status = 404;
      return next(error);
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid status value.");
        error.status = 400;
        return next(error);
      }
      application.status = status;
      application.reviewedBy = req.admin?._id;
    }

    if (notes !== undefined) application.notes = notes;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application updated successfully.",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Delete application ───────────────────────────────────────────────
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await CandidateApplication.findById(req.params.id);

    if (!application) {
      const error = new Error("Application not found");
      error.status = 404;
      return next(error);
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};