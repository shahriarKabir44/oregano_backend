var mongoose = require('mongoose')

let orderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId },
    postId: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number }

})

const OrderItem = mongoose.model('orderItem', orderItemSchema)
module.exports = OrderItem