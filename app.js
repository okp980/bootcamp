const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")

const bootcampRoute = require("./route/bootcamps")

dotenv.config()
const app = express()

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"))
}

app.use("/api/v1/bootcamps", bootcampRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`The server is runing on ${process.env.NODE_ENV} on port ${PORT}`)
})
