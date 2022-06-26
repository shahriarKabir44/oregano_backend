const mongoose = require("mongoose");

const availableItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    tag: { type: String },
    day: { type: Number },
    unitPrice: { type: Number },
    rating: { type: Number, default: 0 },
    ratedBy: { type: Number }, //number of people rated
    region: { type: String },
    isAvailable: { type: Number },
    numPeopleRated: { type: Number, default: 0 }
})

let AvailableItem = mongoose.model('availableItem', availableItemSchema)
module.exports = AvailableItem