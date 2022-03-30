let OrderController = require('express').Router()
let order = require('../schemas/order')
let notification = require('../schemas/notifications')
OrderController.get('/getPendingOrders', (req, res) => {
    order.find({ $and: [{ status: 1 }, { riderId: null }] })
        .then(data => {
            res.send({ data: data })
        })
})

OrderController.post('/assignRider', async (req, res) => {
    let data = await order.findByIdAndUpdate(req.body.orderId, { riderId: req.body.riderId })
    let newNotification = new notification({
        type: 4,
        isSeen: 0,
        recipient: req.body.riderId,
        relatedSchemaId: req.body.orderId,
        time: (new Date()) * 1,
        message: "You have been assigned a new Delivery.",
    })
    await newNotification.save()
    res.send({ data: data });
})
OrderController.get('/acceptOrder/:orderId', (req, res) => {
    order.findByIdAndUpdate(req.params.orderId, { status: 1 })
        .then(data => {
            startSending()
            return data

        })
        .then(next => {
            res.send({ data: "done" })
        })
})
OrderController.post('/createNewOrder', async (req, res) => {
    let newOrder = new order(req.body)
    let { notificationMessage, time, sellerId } = req.body;
    await newOrder.save()
    let newNotification = new notification({
        type: 1,
        isSeen: 0,
        recipient: sellerId,
        relatedSchemaId: newOrder._id,
        time: time,
        message: notificationMessage,
    })
    await newNotification.save();
    res.send({ data: newOrder })
})


module.exports = OrderController