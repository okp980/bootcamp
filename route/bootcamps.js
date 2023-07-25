const express = require("express")
const {
  getBootcamps,
  getSingleBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsAroundZipcode,
} = require("../controller/bootcamps")
const { protect, authorize } = require("../middleware/auth")

const courseRouter = require("./course")
const reviewRouter = require("./review")
const router = express.Router()

//Re-route routes
router.use("/:bootcampId/courses", courseRouter)
router.use("/:bootcampId/reviews", reviewRouter)

router
  .route("/")
  .get(getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp)

router
  .route("/:id")
  .get(getSingleBootcamps)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp)

router
  .route("/radius/:zipcode/:distance")
  .get(protect, getBootcampsAroundZipcode)

module.exports = router
