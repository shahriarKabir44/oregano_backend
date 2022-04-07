const Order = require('../schemas/order');

const ManagementController = require('express').Router();

ManagementController.get('/unpaidDeliveries', (req, res) => {
    res.render('unpaidDeliveries.ejs')
})
ManagementController.get('/', (req, res) => {
    res.render('allOrders.ejs')
})
ManagementController.get('/unAssignedDeliveries', (req, res) => {
    res.render('unAssignedDeliveries.ejs')
})


ManagementController.post('/markPaid', (req, res) => {
    Order.findByIdAndUpdate(req.body.orderId, { $set: { status: 6 } })
        .then((data) => {
            console.log(data);
            res.send({ data: 1 })
        })
})

ManagementController.get('/getAllOrders', (req, res) => {
    Order.find({})
        .then(data => {
            res.send({ data: data })
        })
})

module.exports = ManagementController