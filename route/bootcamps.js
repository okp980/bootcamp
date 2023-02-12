const express = require("express")
const {
  getBootcamps,
  getSingleBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controller/bootcamps")
const router = express.Router()

router.route("/").get(getBootcamps).post(createBootcamp)

router
  .route("/:id")
  .get(getSingleBootcamps)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

module.exports = router
