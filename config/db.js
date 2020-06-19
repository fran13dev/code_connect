const mongoose = require('mongoose'),
  keys = require('./keys'),
  uri = keys.mongodb.uri

const connectDB = async () => {
  try {
    await mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      },
      () => console.log('Connection to mongoDB established')
    )
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
