const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const fs = require("fs")
const YAML = require("yaml")
const swaggerUi = require("swagger-ui-express")

// sercurity
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")

const connect = require("./db")
const errorHandler = require("./middleware/errorHandler")
const ErrorResponse = require("./util/ErrorResponse")

// routes
const bootcampRoute = require("./route/bootcamps")
const courseRoute = require("./route/course")
const AuthRoute = require("./route/auth")
const UserRoute = require("./route/users")
const ReviewRoute = require("./route/review")

dotenv.config()

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

// connect to db
// connect()

const app = express()

app.use(express.json())

// mongo sanitizer
app.use(mongoSanitize())

// helmet
app.use(helmet())

// xxs clean
app.use(xss())

// prevent http param pollution
app.use(hpp())

// Apply the rate limiting middleware to all requests
app.use(limiter)

// cors
app.use(cors())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"))
}

// swagger documentation
const file = fs.readFileSync("./swagger.yaml", "utf8")
const swaggerDocument = YAML.parse(file)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// routes
app.use("/api/v1/bootcamps", bootcampRoute)
app.use("/api/v1/courses", courseRoute)
app.use("/api/v1/auth", AuthRoute)
app.use("/api/v1/users", UserRoute)
app.use("/api/v1/reviews", ReviewRoute)

// 404 error
app.use((req, res, next) => {
  next(new ErrorResponse("Page Not Found", 404))
})

// error middleware
app.use(errorHandler)

module.exports = app
