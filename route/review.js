const express = require("express")
const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controller/review")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(protect, getAllReviews)
  .post(protect, authorize("user, admin"), createReview)
router
  .route("/:reviewID")
  .put(protect, authorize("user, admin"), updateReview)
  .delete(protect, authorize("user, admin"), deleteReview)

module.exports = router
