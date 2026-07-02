// 404 handler
exports.notFound = (req, res, next) => {
  const err  = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

// Global error handler
exports.errorHandler = (err, req, res, next) => {
  // Multer errors (file too large, wrong field, too many files, etc.)
  if (err.name === "MulterError") {
    const multerMessages = {
      LIMIT_FILE_SIZE: "File is too large. Maximum size is 5MB.",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field. Please check your uploaded documents.",
      LIMIT_FILE_COUNT: "Too many files uploaded.",
    };
    return res.status(400).json({
      message: multerMessages[err.code] || err.message,
    });
  }
  
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation failed", errors: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ID format: ${err.value}` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError")  return res.status(401).json({ message: "Invalid token" });
  if (err.name === "TokenExpiredError")  return res.status(401).json({ message: "Token expired" });

  const statusCode = err.status || err.statusCode || 500;
  const message    = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${statusCode} - ${message}\n`, err.stack);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
