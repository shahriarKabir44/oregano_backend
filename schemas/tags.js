var mongoose = require('mongoose')
let tagScgema = new mongoose.Schema({
    tagName: { type: String },
    postId: { type: mongoose.Schema.Types.ObjectId },
})
const Tag = mongoose.model('tag', tagScgema)
module.exports = Tag