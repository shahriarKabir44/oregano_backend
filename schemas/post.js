var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    itemName: { type: String },
    images: { type: String },
    amountProduced: { type: Number },
    unitPrice: { type: Number },
    tags: { type: String },
    unitType: { type: String },
    country: { type: String },
    district: { type: String },
    city: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    postedOn: { type: Number },
    postedBy: { type: mongoose.Schema.Types.ObjectId },

})

const Post = mongoose.model('Post', postSchema)
module.exports = Post