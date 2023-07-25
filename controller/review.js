//@desc - Get All Reviews
//@route - GET api/v1/bootcamp/:bootcampId/reviews
// @access - Private
exports.getAllReviews = async function (req, res, next) {
  const bootcamp = Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) return next(ErrorResponse("Bootcamp not found", 404))
  const reviews = await Review.find({
    bootcamp: req.params.bootcampId,
  }).populate("bootcamp", "name description")

  res.status(200).json({ success: true, count: reviews.length, data: reviews })
  try {
  } catch (error) {
    next(error)
  }
}

//@desc - Create Review
//@route - POST api/v1/bootcamp/:bootcampId/reviews
// @access - Private

const Bootcamp = require("../model/Bootcamp")
const Review = require("../model/Review")
const ErrorResponse = require("../util/ErrorResponse")

exports.createReview = async function (req, res, next) {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id
  try {
    const review = await Review.create(req.body)
    res.status(201).json({ success: true, data: review })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single Reviews
//@route - GET api/v1/reviews/:reviewID
// @access - Private
exports.getSingleReview = async function (req, res, next) {
  const review = await Review.findById(req.params.reviewID)
  if (!review) return next(ErrorResponse("Review not found", 404))
  res.status(200).json({ success: true, data: review })
  try {
  } catch (error) {
    next(error)
  }
}

//@desc - Update Review
//@route - PUT api/v1/reviews/:reviewID
// @access - Private
exports.updateReview = async function (req, res, next) {
  let review = await Review.findById(req.params.reviewID)
  if (!review) return next(ErrorResponse("Review not found", 404))
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(ErrorResponse("User not allowed to delete this review", 400))
  }
  review = await Review.findByIdAndUpdate(req.params.reviewID, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: review })
  try {
  } catch (error) {
    next(error)
  }
}

//@desc - Delete Review
//@route - DELETE api/v1/reviews/:reviewID
// @access - Private
exports.deleteReview = async function (req, res, next) {
  const review = await Review.findById(req.params.reviewID)
  if (!review) return next(ErrorResponse("Review not found", 404))
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(ErrorResponse("User not allowed to delete this review", 400))
  }
  await review.remove()
  res.status(200).json({ success: true, data: {} })
  try {
  } catch (error) {
    next(error)
  }
}
