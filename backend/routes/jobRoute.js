const express = require("express")
const { getAllJobs, getDepartments, getJobsByDepartment, getJobById, getJobByJobId, createJob, updateJob, deleteJob, getJobStats } = require("../controllers/jobController")
const { protect, adminOnly } = require("../middleware/authMiddleware")
const router = express.Router()


// Public api get all jobs
router.get("/", getAllJobs)
router.get("/department", getDepartments),
router.get("/department/:department", getJobsByDepartment)
router.get("/:id", getJobById)
router.get('/by-jobid/:jobId', getJobByJobId)

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