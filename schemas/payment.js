var mongoose = require('mongoose')

var paymentSchema = new mongoose.Schema({
    deliveryId:{type: mongoose.Schema.ObjectId},
    approvedBy:{type: mongoose.Schema.ObjectId},
    status:{type:Number}
 })

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment