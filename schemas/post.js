var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    itemName: { type: String },
    images: { type: String  },
    lattitude: { type: Number },
    longitude: { type: Number },
    postedBy:{type: mongoose.Schema.ObjectId},
    amountProduced:{ type: Number },
    unitPrice:{ type: Number },
    stock:{ type: Number },
    time:{ type: Number },
    rating:{ type: Number }
    
})

const Post = mongoose.model('Post', postSchema)
module.exports = Post