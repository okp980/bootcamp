const { model, Schema } = require("mongoose")

const reviewSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter a title"],
    maxLength: 100,
  },
  text: {
    type: String,
    trim: true,
    required: [true, "Please enter a description"],
  },
  rating: {
    type: Number,
    required: [true, "Please enter a rating between 1 and 10"],
    min: 1,
    max: 10,
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

reviewSchema.statics.getAvgRatings = async function (bootcampId) {
  const agg = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: {
        _id: "$bootcamp",
        average: { $avg: "$rating" },
      },
    },
  ])
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: agg[0].average,
    })
  } catch (error) {
    console.log(error)
  }
}

reviewSchema.post("save", async function (next) {
  this.constructor.getAvgRatings(this.bootcamp)
})

reviewSchema.pre("remove", async function (next) {
  this.constructor.getAvgRatings(this.bootcamp)
})

const Review = model("Review", reviewSchema)

module.exports = Review
