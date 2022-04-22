var mongoose = require('mongoose')

var ratingSchema = new mongoose.Schema({
    lowerCasedName: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId },
    rating: { type: Number },
    ownerId: { type: mongoose.Schema.Types.ObjectId }
})

const Rating = mongoose.model('rating', ratingSchema)
module.exports = Rating