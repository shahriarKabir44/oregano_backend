var mongoose = require('mongoose')

let orderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId },
    itemName: { type: String },
    lowerCasedName: { type: String },
    amount: { type: Number },
    status: { type: Number },
    totalPrice: {type:Number}
})

const OrderItem = mongoose.model('orderItem', orderItemSchema)
module.exports = OrderItem