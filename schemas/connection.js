const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId },
    followee: { type: mongoose.Schema.Types.ObjectId }
})

let Connection = new mongoose.model('connection', connectionSchema)
module.exports = Connection