//@desc -  get all bootcamps
//@route - GET /api/v1/bootcamps
//@access - Public
exports.getBootcamps = (req, res) => {
  res.status(200).json({ success: true, message: "all bootcamps" })
}

//@desc -  get single bootcamp
//@route - GET /api/v1/bootcamps/:id
//@access - Public
exports.getSingleBootcamps = (req, res) => {
  res.status(200).json({ success: true, message: "single bootcamp" })
}

//@desc -  create a bootcamp
//@route - POST /api/v1/bootcamps
//@access - Private
exports.createBootcamp = (req, res) => {
  res.status(200).json({ success: true, message: "create a bootcamp" })
}

//@desc -  update a single bootcamp
//@route - PUT /api/v1/bootcamps/:id
//@access - Private
exports.updateBootcamp = (req, res) => {
  res.status(200).json({ success: true, message: "update to a bootcamp" })
}

//@desc -  delete a single bootcamp
//@route - DELETE /api/v1/bootcamps/:id
//@access - Private
exports.deleteBootcamp = (req, res) => {
  res.status(200).json({ success: true, message: "delete a bootcamp" })
}
