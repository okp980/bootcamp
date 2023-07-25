const Bootcamp = require("../model/Bootcamp")
const Course = require("../model/Course")
const ErrorResponse = require("../util/ErrorResponse")

//@desc -  get courses in bootcamp or all courses
//@route - GET /api/v1/bootcamps/:bootcampId/courses
//@route - GET /api/v1/courses
//@access - Public
exports.getCourses = async (req, res, next) => {
  try {
    let courses
    if (req.params.bootcampId) {
      courses = await Course.find({ bootcamp: req.params.bootcampId })
    } else {
      courses = await Course.find().populate("bootcamp", "name description")
    }

    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses })
  } catch (error) {
    next(error)
  }
}

//@desc -  get single course
//@route - GET /api/v1/courses/:courseId
//@access - Public
exports.getSingleCourses = async (req, res, next) => {
  const courseId = req.params.courseId
  try {
    const course = await Course.findById(courseId).populate(
      "bootcamp",
      "named description"
    )
    if (!course) {
      return next(new ErrorResponse("Course not found", 404))
    }
    res.status(200).json({ success: true, data: course })
  } catch (error) {
    next(error)
  }
}

//@desc -  create a course in bootcamp
//@route - POST /api/v1/bootcamps/:bootcampId/courses
//@access - Private
exports.createCourse = async (req, res, next) => {
  const { bootcampId } = req.params
  req.body.bootcamp = bootcampId
  try {
    const bootcamp = await Bootcamp.findById(bootcampId)
    if (!bootcamp) {
      return next(new ErrorResponse("Bootcamp not found", 404))
    }
    const course = await Course.create(req.body)
    res.status(201).json({ success: true, data: course })
  } catch (error) {
    next(error)
  }
}

//@desc -  update a course in bootcamp
//@route - PUT /api/v1/courses/:courseId
//@access - Private
exports.updateCourse = async (req, res, next) => {
  const { courseId } = req.params
  let course
  try {
    course = await Course.findById(courseId)
    if (!course) {
      return next(new ErrorResponse("Course not found", 404))
    }
    if (course.user.toString() !== req.user.id && req.user.roles !== "admin") {
      return next(new ErrorResponse("Not Allowed", 403))
    }
    course = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
      runValidators: true,
    })
    res
      .status(200)
      .json({ success: true, message: "Updated successfully", data: course })
  } catch (error) {
    next(error)
  }
}

//@desc -  delete a course in bootcamp
//@route - DELETE /api/v1/courses/:courseId
//@access - Private
exports.deleteCourse = async (req, res, next) => {
  const { courseId } = req.params

  let course
  try {
    course = await Course.findById(courseId)
    if (!course) {
      return next(new ErrorResponse("Course not found", 404))
    }
    if (course.user.toString() !== req.user.id && req.user.roles !== "admin") {
      return next(new ErrorResponse("Not Allowed", 403))
    }
    await Course.findByIdAndRemove(courseId)
    res
      .status(200)
      .json({ success: true, message: "Deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
