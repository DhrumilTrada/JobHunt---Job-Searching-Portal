import express from "express"
import { postJob, adminJobs, getAllJobs, getJobById } from "../controllers/job.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
const router = express.Router()

router.route("/post").post(isAuthenticated, postJob)
router.route("/get").get(getAllJobs)
router.route("/get/:id").get(isAuthenticated, getJobById)
router.route("/getadminjobs").get(isAuthenticated, adminJobs)

export default router