var mongoose = require('mongoose')

var userTagRatingSchema = new mongoose.Schema({
    tagName: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId },
    avg_rating: { type: Number },

})

const UserTagRating = mongoose.model('userTagRatingSchema', userTagRatingSchema)
module.exports = UserTagRating 