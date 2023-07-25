const express = require("express")
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} = require("../controller/users")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

router
  .route("/")
  .get(protect, authorize("admin"), getUsers)
  .post(protect, authorize("admin"), createUser)
router
  .route("/:userId")
  .get(protect, authorize("admin"), getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser)

module.exports = router
