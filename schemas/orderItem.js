var mongoose = require('mongoose')

let orderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Objectid },
    postId: { type: mongoose.Objectid },
    amount: { type: Number }

})

const OrderItem = mongoose.model('orderItem', orderItemSchema)
module.exports = OrderItem