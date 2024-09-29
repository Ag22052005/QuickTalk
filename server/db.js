const mongoose = require('mongoose')
const URL = process.env.MONGO_URL
mongoose.connect(URL)
const db = mongoose.connection


db.on('connected',()=>{
  console.log('db connected......')
})
db.on('disconnected',()=>{
  console.log('db disconnected......')
})

module.exports = db;
