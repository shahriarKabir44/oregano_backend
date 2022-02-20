var mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
    drop_lat: { type: Number },
    drop_long: { type: Number },
    buyerId:{type: mongoose.Schema.ObjectId},
    time:{ type: Number },
    
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order