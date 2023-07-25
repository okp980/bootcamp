const http = require("http")
const dotenv = require("dotenv")
const app = require("./app")
// const connect = require("./db")
dotenv.config()

const server = http.createServer(app)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`The server is runing on ${process.env.NODE_ENV} on port ${PORT}`)
})

// handle unhandled promise rejection

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)

  // Close server and exit
  server.close(() => process.exit(1))
})
