const Bootcamp = require("../model/Bootcamp")
const ErrorResponse = require("../util/ErrorResponse")
const geocoder = require("../util/geocoder")

//@desc -  get all bootcamps
//@route - GET /api/v1/bootcamps
//@access - Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find().populate("courses")
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch (error) {
    next(error)
  }
}

//@desc -  get all bootcamps within a specified location
//@route - GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access - Public
exports.getBootcampsAroundZipcode = async (req, res, next) => {
  const { zipcode, distance } = req.params
  const radius = distance / 3963
  console.log(distance)

  try {
    const loc = await geocoder.geocode(zipcode)
    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: {
          $centerSphere: [[loc[0].longitude, loc[0].latitude], radius],
        },
      },
    })
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch (error) {
    next(error)
  }
}

//@desc -  get single bootcamp
//@route - GET /api/v1/bootcamps/:id
//@access - Public
exports.getSingleBootcamps = async (req, res, next) => {
  const { id } = req.params

  try {
    const bootcamp = await Bootcamp.findById(id)

    if (bootcamp === null) {
      return next(new ErrorResponse("Not Found", 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
  } catch (error) {
    next(error)
  }
}

//@desc -  create a bootcamp
//@route - POST /api/v1/bootcamps
//@access - Private
exports.createBootcamp = async (req, res, next) => {
  req.body.user = req.user.id
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
      success: true,
      message: "bootcamp successfully created",
      data: bootcamp,
    })
  } catch (error) {
    next(error)
  }
}

//@desc -  update a single bootcamp
//@route - PUT /api/v1/bootcamps/:id
//@access - Private
exports.updateBootcamp = async (req, res, next) => {
  const { id } = req.params

  try {
    let bootcamp = await Bootcamp.findById(id)
    if (!bootcamp) {
      return next(new ErrorResponse("Not Found", 404))
    }
    if (
      bootcamp.user.toString() !== req.user.id &&
      req.user.roles !== "admin"
    ) {
      return next(new ErrorResponse("Not Allowed", 403))
    }
    bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, { new: true })

    res
      .status(200)
      .json({ success: true, data: bootcamp, message: "update to a bootcamp" })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

//@desc -  delete a single bootcamp
//@route - DELETE /api/v1/bootcamps/:id
//@access - Private
exports.deleteBootcamp = async (req, res, next) => {
  const { id } = req.params

  try {
    const bootcamp = await Bootcamp.findById(id)
    if (!bootcamp) {
      return next(new ErrorResponse("Not Found", 404))
    }
    if (
      bootcamp.user.toString() !== req.user.id &&
      req.user.roles !== "admin"
    ) {
      return next(new ErrorResponse("Not Allowed", 403))
    }

    await Bootcamp.findByIdAndDelete(id)

    res
      .status(200)
      .json({ success: true, data: {}, message: "deleted successfully" })
  } catch (error) {
    next(error)
  }
}
