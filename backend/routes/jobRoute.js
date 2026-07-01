const express = require("express")
const { getAllJobs, getDepartments, getJobsByDepartment, getJobById, getJobByJobId, createJob, updateJob, deleteJob, getJobStats, getAdminJobs} = require("../controllers/jobController")
const { protect, adminOnly } = require("../middleware/authMiddleware")
const router = express.Router()


// Public api get all jobs
router.get("/", getAllJobs)
router.get("/department", getDepartments),
router.get("/department/:department", getJobsByDepartment)
router.get('/by-jobid/:jobId', getJobByJobId)

// ── NEW: Admin listing — search + every status (Active/Inactive/All) ──────
// Placed above "/:id" only for readability; not required for correctness
// since this path has two segments and ":id" only matches one.
router.get('/admin/all',
    protect,
    adminOnly,
    getAdminJobs
)
 
router.get("/:id", getJobById)
 

// create a job by admin
router.post('/', 
    protect, 
    adminOnly, 
    createJob)

router.put('/:id', 
    protect, 
    adminOnly, 
    updateJob)

router.delete('/:id',
    protect,
    adminOnly,
    deleteJob
)

router.get('/admin/stats',
    protect,
    adminOnly,
    getJobStats
)

module.exports = router;