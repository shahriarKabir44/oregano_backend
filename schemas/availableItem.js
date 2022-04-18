const mongoose = require("mongoose");

const availableItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    tag: { type: String },
    day: { type: Number }
})

let AvailableItem = mongoose.model('availableItem', availableItemSchema)
module.exports = AvailableItem