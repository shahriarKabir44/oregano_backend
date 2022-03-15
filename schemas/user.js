var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    facebookToken: { type: String },
    phone: { type: String, unique: true },
    currentLatitude: { type: Number },
    currentLongitude: { type: Number },
    isRider: { type: Number },
    rating: { type: Number },
    currentCity: { type: String }
})

const User = mongoose.model('User', userSchema)
module.exports = User