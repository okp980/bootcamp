const NodeGeocoder = require("node-geocoder")

const options = {
  provider: "opencage",
  httpAdapter: "https",
  apiKey: process.env.MAP_KEY,
  formatter: null,
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder
