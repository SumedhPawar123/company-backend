const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Store candidate documents in uploads/candidates so they don't mix
// with any other upload types you already have in uploads/
const uploadDir = path.join(__dirname, "..", "uploads", "candidates");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error("Unsupported file type. Allowed: PDF, JPG, PNG, DOC, DOCX.");
    err.status = 400;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Candidate application form sends 3 files under these field names
exports.uploadCandidateDocs = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
  { name: "passportPhoto", maxCount: 1 },
]);