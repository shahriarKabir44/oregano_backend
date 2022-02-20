var mongoose = require('mongoose')

var deliverySchema = new mongoose.Schema({
    pickup_lat: { type: Number },
    pickup_long: { type: Number },
    orderId:{type: mongoose.Schema.ObjectId},
    time:{ type: Number },
    charge:{ type: Number },
    sellerId:{type: mongoose.Schema.ObjectId},
    status:{ type: Number },
    riderId:{type: mongoose.Schema.ObjectId}
})

const Delivery = mongoose.model('Delivery', deliverySchema)
module.exports = Delivery