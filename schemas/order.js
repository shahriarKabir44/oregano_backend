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
    itemsCount: { type: Number },
    isPaid: { type: Number },
    isRated: { type: Number },
    deliveryTime: { type: Number },
    city: { type: String }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order

/*
status:

status:

0= order pending
-1= order approved  
-2= searching for rider
2= order rejected
3=: rider assigned
4= order picked up (awaiting delivery)
5= order delivered and pending payment (awaiting payment)
6= payment completed (paid)
order status 5+ is shown in user's order history
if rider is unavailable, the management team will cancel the order
*/