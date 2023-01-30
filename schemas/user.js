var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    profileImageURL: { type: String },
    phone: { type: String, unique: true },
    currentLatitude: { type: Number },
    currentLongitude: { type: Number },
    isRider: { type: Number },
    rating: { type: Number },
    currentCity: { type: String },
    locationInfo: { type: String },
    expoPushToken: { type: String },
    region: { type: String },
    name: { type: String },
    facebookId: { type: Number },
    currentLocationName: { type: String },
    coverPhotoURL: { type: String }
})

const User = mongoose.model('User', userSchema)
module.exports = User