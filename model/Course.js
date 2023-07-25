const { Schema, model } = require("mongoose")

const courseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "title is required"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "description is required"],
  },
  weeks: {
    type: Number,
    required: [true, "weeks is required"],
  },
  tuition: {
    type: Number,
    required: [true, "tuition is required"],
  },
  minimumSkill: {
    type: String,
    enum: ["beginner", "intermediate"],
    required: [true, "minimumSkill is required"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

courseSchema.statics.getAveragePrice = async function (bootcampId) {
  const agg = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averagePrice: { $avg: "$tuition" },
      },
    },
  ])

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averagePrice: Math.ceil(agg[0].averagePrice / 10) * 10,
    })
  } catch (error) {
    console.log(error)
  }
}

courseSchema.pre("remove", function (next) {
  this.constructor.getAveragePrice(this.bootcamp)
})
courseSchema.post("save", function (next) {
  this.constructor.getAveragePrice(this.bootcamp)
})

const Course = model("Course", courseSchema)

module.exports = Course
