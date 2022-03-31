var mongoose = require('mongoose')

var notificationSchema = new mongoose.Schema({
    type: { type: Number },
    isSeen: { type: Number },
    recipient: { type: mongoose.Schema.Types.ObjectId },
    relatedSchemaId: { type: mongoose.Schema.Types.ObjectId },
    time: { type: Number },
    message: { type: String },
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification

/*
1: someone ordered my food -> orderId => sellerId=self.id && buyerId= buyer.id && status==0
2: Someone is unable to provide the item -> none
3: Rider has picked up my order -> none
4: I am assigned for a delivery -> delivery => riderId=self.id && status==0
5: I have to rate an item -> item.id
6: Order arrived

note: a rider will be manually called over the phone number before assigning

todo:
create a popup to request for rating when the app is opened 

*/