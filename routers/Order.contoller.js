let OrderController = require('express').Router()
let order = require('../schemas/order')
let notification = require('../schemas/notifications')
let orderItem = require('../schemas/orderItem')
const { findAdminAndNotify } = require('../utils/sendNotifications')
const User = require('../schemas/user')
const pushNotificationManager = require('../utils/pushNotificationManager')

OrderController.get('/getPendingOrders', (req, res) => {
    order.find({ $and: [{ status: 1 }, { riderId: null }] })
        .then(data => {
            res.send({ data: data })
        })
})

OrderController.post('/markPickedUp', async (req, res) => {

    findAdminAndNotify(req.body.orderId)
    res.send({ data: 1 })
    await Promise.all([
        order.findByIdAndUpdate(req.body.orderId, { $set: { status: 4, deliveryTime: (new Date()) * 1 } }),
        (async () => {
            let newNotification = new notification({
                type: 3,
                isSeen: 0,
                recipient: req.body.buyerId,
                relatedSchemaId: req.body.orderId,
                time: (new Date()) * 1,
                message: "A rider has picked up your order.",
            })
            await newNotification.save()
        })(),
        (async () => {
            let receiver = await User.findById(req.body.buyerId)
            let receiverToken = receiver.expoPushToken
            await pushNotificationManager({
                to: receiverToken,
                message: "A rider has picked up your order."
            })
        })()
    ]).catch(e => {
    })




})

OrderController.post('/markDelivered', async (req, res) => {
    findAdminAndNotify(req.body.orderId)
    res.send({ data: 1 })
    await Promise.all([
        order.findByIdAndUpdate(req.body.orderId, { $set: { status: 5 } }),
        (async () => {
            let newNotification = new notification({
                type: 6,
                isSeen: 0,
                recipient: req.body.buyerId,
                relatedSchemaId: req.body.orderId,
                time: (new Date()) * 1,
                message: "Your order has arrived. Please pick up.",
            })
            await newNotification.save()
        })(),
        (async () => {
            let receiver = await User.findById(req.body.buyerId)
            let receiverToken = receiver.expoPushToken
            await pushNotificationManager({
                to: receiverToken,
                message: "Your order has arrived. Please pick up."
            })
        })()])


})

OrderController.post('/assignRider', async (req, res) => {
    res.send({ data: 1 });
    await Promise.all([
        order.findByIdAndUpdate(req.body.orderId, { $set: { riderId: req.body.riderId, status: 3 } }),
        (async () => {
            let newNotification = new notification({
                type: 4,
                isSeen: 0,
                recipient: req.body.riderId,
                relatedSchemaId: req.body.orderId,
                time: (new Date()) * 1,
                message: "You have been assigned a new Delivery.",
            })
            await newNotification.save()
        })(),
        (async () => {
            let receiver = await User.findById(req.body.riderId)
            let receiverToken = receiver.expoPushToken
            await pushNotificationManager({
                to: receiverToken,
                message: "You have been assigned a new Delivery."
            })
        })()])

})
OrderController.get('/acceptOrder/:orderId', (req, res) => {
    order.findByIdAndUpdate(req.params.orderId, { status: -1 })
        .then(data => {

            return data

        })
        .then(next => {
            res.send({ data: "done" })
        })
})

OrderController.get('/requestRider/:orderId', (req, res) => {
    order.findByIdAndUpdate(req.params.orderId, { status: -2 })
        .then(data => {
            findAdminAndNotify(req.params.orderId)
            res.send({ data: data })
        })
})

OrderController.post('/createNewOrder', async (req, res) => {

    let { notificationMessage, time, sellerId } = req.body;
    let newOrder = new order({ ...req.body, isRated: 0 })
    await newOrder.save()
    res.send({ data: newOrder })
    let newNotification = new notification({
        type: 1,
        isSeen: 0,
        recipient: sellerId,
        relatedSchemaId: newOrder._id,
        time: time,
        message: notificationMessage,
    })
    await newNotification.save();

    let receiver = await User.findById(req.body.sellerId)
    let receiverToken = receiver.expoPushToken
    await pushNotificationManager({
        to: receiverToken,
        message: notificationMessage
    })


})

OrderController.post('/rejectOrder', async (req, res) => {
    res.send({ data: 1 })
    await Promise.all([
        order.findByIdAndUpdate(req.body.orderId, { status: 2 }),
        (async () => {
            let newNotification = new notification({
                type: 7,
                isSeen: 0,
                recipient: req.body.buyerId,
                relatedSchemaId: req.body.orderId,
                time: (new Date()) * 1,
                message: req.body.notificationMessage,
            })
            await newNotification.save()
        })(),
        (async () => {
            let receiver = await User.findById(req.body.buyerId)
            let receiverToken = receiver.expoPushToken
            await pushNotificationManager({
                to: receiverToken,
                message: notificationMessage
            })
        })()
    ])


})

OrderController.post('/rejectOrderItem', async (req, res) => {
    await Promise.all([
        orderItem.findOneAndUpdate({
            $and: [
                { orderId: req.body.orderId },
                { postId: req.body.postId }
            ]
        }, { status: 0 }),
        (async () => {
            if (req.body.shouldGenerateNotification) {
                let newNotification = new notification({
                    type: 2,
                    isSeen: 0,
                    recipient: req.body.buyerId,
                    relatedSchemaId: req.body.orderId,
                    time: (new Date()) * 1,
                    message: req.body.notificationMessage,
                })
                await newNotification.save()
            }
        })(),
        (async () => {
            let receiver = await User.findById(req.body.buyerId)
            let receiverToken = receiver.expoPushToken
            await pushNotificationManager({
                to: receiverToken,
                message: notificationMessage
            })
        })()
    ])


    res.send({ data: 1 })
})

module.exports = OrderController