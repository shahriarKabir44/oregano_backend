var mongoose = require('mongoose')

let orderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Objectid },
    postId: { type: mongoose.Schema.Objectid },
    amount: { type: Number }

})

const OrderItem = mongoose.model('orderItem', orderItemSchema)
module.exports = OrderItem