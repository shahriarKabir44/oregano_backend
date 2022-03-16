var mongoose = require('mongoose')

var paymentSchema = new mongoose.Schema({
    deliveryId: { type: mongoose.Schema.Types.ObjectId },
    approvedBy: { type: mongoose.Schema.Types.ObjectId },
    status: { type: Number }
})

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment