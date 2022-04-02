var mongoose = require('mongoose')

var ratingSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId },
    ratedBy: { type: mongoose.Schema.Types.ObjectId },
    rating: { type: Number },

})

const Rating = mongoose.model('rating', ratingSchema)
module.exports = Rating