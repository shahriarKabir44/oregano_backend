var mongoose = require('mongoose')

let otpSchema = new mongoose.Schema({
    phone: { type: String },
    otp: { type: Number }
})

const OTP = mongoose.model('OTP', otpSchema)
module.exports = OTP