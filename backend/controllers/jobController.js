const Job = require("../models/Job");

// Get All Jobs
exports.getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, department, type, level } = req.query;

    const filter = { isActive: true };

    if (department) filter.department = department;
    if (type) filter.type = type;
    if (level) filter.experienceLevel = level;

    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Job By ID
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job || !job.isActive) {
      const error = new Error("Job not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Get Job By Job ID
exports.getJobByJobId = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      jobId: req.params.jobId,
      isActive: true,
    });

    if (!job) {
      const error = new Error("Job not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Create Job
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user?.userId
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Update Job
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      const error = new Error("Job not found");
      error.status = 404;
      return next(error);
    }

    Object.assign(job, req.body);
    job.updatedAt = Date.now();

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Job (Soft Delete)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      const error = new Error("Job not found");
      error.status = 404;
      return next(error);
    }

    job.isActive = false;
    job.updatedAt = Date.now();

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Get Jobs By Department
exports.getJobsByDepartment = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      department: req.params.department,
      isActive: true,
    }).sort({ postedDate: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Get Departments
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Job.distinct("department", {
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: departments.sort(),
    });
  } catch (error) {
    next(error);
  }
};

// Get Job Statistics
exports.getJobStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments({ isActive: true });

    const jobsByDepartment = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
    ]);

    const jobsByType = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        jobsByDepartment,
        jobsByType,
      },
    });
  } catch (error) {
    next(error);
  }
};