const connectDB = require("./db")
const path = require("path")
const fs = require("fs")
const Bootcamp = require("./model/Bootcamp")
const Course = require("./model/Course")
const User = require("./model/User")
const Review = require("./model/Review")

async function importData() {
  try {
    await connectDB()
    const bootcamps = JSON.parse(
      fs.readFileSync(path.join(__dirname, "_data", "bootcamps.json"), "utf8")
    )
    const courses = JSON.parse(
      fs.readFileSync(path.join(__dirname, "_data", "courses.json"), "utf8")
    )
    const users = JSON.parse(
      fs.readFileSync(path.join(__dirname, "_data", "users.json"), "utf8")
    )
    const reviews = JSON.parse(
      fs.readFileSync(path.join(__dirname, "_data", "reviews.json"), "utf8")
    )
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)
    console.log(" document successfully created")

    process.exit()
  } catch (e) {
    console.log(e)

    process.exit(1)
  }
}

async function removeData() {
  try {
    await connectDB()
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log("document successfully deleted")

    process.exit()
  } catch (e) {
    console.log(e)

    process.exit(1)
  }
}

function seeder() {
  if (process.argv[2] === "-i") {
    importData()
  } else if (process.argv[2] === "-d") {
    removeData()
  } else {
    process.exit(1)
  }
}

seeder()

// connnect to the database
// load data from file
// save data to database
