var mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
    drop_lat: { type: Number },
    drop_long: { type: Number },
    dropLocationGeocode: { type: String },
    buyerId: { type: mongoose.Schema.Objectid },
    sellerId: { type: mongoose.Schema.Objectid },
    riderId: { type: mongoose.Schema.Objectid },
    status: { type: Number },
    charge: { type: Number },
    time: { type: Number },

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