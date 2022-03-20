var mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
    drop_lat: { type: Number },
    drop_long: { type: Number },
    dropLocationGeocode: { type: String },
    buyerId: { type: mongoose.Schema.Types.ObjectId },
    sellerId: { type: mongoose.Schema.Types.ObjectId },
    riderId: { type: mongoose.Schema.Types.ObjectId },
    status: { type: Number },
    charge: { type: Number },
    time: { type: Number },
    pickupLat: { type: Number },
    pickupLong: { type: Number },
    pickupLocationGeocode: { type: String },
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order

/*
status:

0= order pending
1= order rejected
2= order picked up
3= order delivered
*/