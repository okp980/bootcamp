const express = require("express")
const {
  createCourse,
  getCourses,
  getSingleCourses,
  updateCourse,
  deleteCourse,
} = require("../controller/course")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router({ mergeParams: true })

router.route("/").get(getCourses).post(protect, createCourse)

router
  .route("/:courseId")
  .get(getSingleCourses)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse)

module.exports = router
