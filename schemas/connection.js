const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId },
    followeeId: { type: mongoose.Schema.Types.ObjectId }
})

let Connection = mongoose.model('connection', connectionSchema)
module.exports = Connection