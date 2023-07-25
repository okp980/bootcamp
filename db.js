const mongoose = require("mongoose")

mongoose.connection.on("error", function (err) {
  console.log(err)
})
const uri =
  "mongodb+srv://okpunorrex:UFGFL8IgTv735ihL@cluster0.ntwmo7r.mongodb.net/devcamper?retryWrites=true&w=majority"
const connect = async () => {
  const conn = await mongoose.connect(uri)
  console.log("DB is connected : " + conn.connection.host)
}

module.exports = connect
