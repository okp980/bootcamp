const { Schema, model } = require("mongoose")
const slugify = require("slugify")
const opencage = require("opencage-api-client")

const bootcampSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Name Field is required"],
      maxLength: [50, "maximum name length is 50"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description Field is required"],
      maxLength: [200, "maximum name length is 200"],
    },
    slug: String,
    website: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "address is required"],
    },

    averagePrice: Number,
    averageRating: Number,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      type: {
        type: String,
        enum: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattAdaddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      enum: [
        "Web Development",
        "UI/UX",
        "Business",
        "Mobile Development",
        "Data Science",
      ],
      required: true,
    },
    createdAt: { type: Date, default: Date.now() },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

bootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

bootcampSchema.pre("save", async function (next) {
  const loc = await opencage.geocode({ q: this.address })
  const latitude = loc.results[0].geometry.lat
  const longitude = loc.results[0].geometry.lng
  this.location = {
    type: "Point",
    coordinates: [longitude, latitude],
    formattedAddress: loc.results[0].formatted,
    street: loc.results[0].components.road,
    city: loc.results[0].components.city,
    state: loc.results[0].components.state,
    zipcode: loc.results[0].components.postcode,
    country: loc.results[0].components.country,
  }

  this.address = undefined
  next()
})

bootcampSchema.pre("findOneAndRemove", async function (next) {
  console.log("deleted from here in the deleteOne middleware")
  await this.model("Course").deleteMany({ bootcamp: this._id })
  next()
})

bootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: true,
})

const Bootcamp = model("Bootcamp", bootcampSchema)

module.exports = Bootcamp
