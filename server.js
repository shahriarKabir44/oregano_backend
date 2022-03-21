const express = require('express')
require('dotenv').config()
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
require('dotenv').config()
const cluster = require('cluster');
const mongoose = require('mongoose')
mongoose.connect(process.env.mongodb_local,
    { useNewUrlParser: true, useUnifiedTopology: true })
const totalCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
    });

} else {
    startExpress();
}
let tag = require('./schemas/tags')
let user = require('./schemas/user')
let order = require('./schemas/order')
let notification = require('./schemas/notifications')
function startExpress() {

    let app = express()
    app.use(express.json())
    app.use(cors())
    app.set('view engine', 'ejs')
    app.use(express.static('static'))
    app.get('/management', (req, res) => {
        res.render('management.ejs')
    })
    app.get('/getAvailableTags', (req, res) => {
        tag.find({}).distinct('tagName').then(data => {
            res.send({ data: data })
        })
    })
    app.get('/getPendingOrders', (req, res) => {
        order.find({ status: 1 })
            .then(data => {
                res.send({ data: data })
            })
    })
    app.post('/createNewOrder', async (req, res) => {
        let newOrder = new order(req.body)
        let { notificationMessage, time, sellerId } = req.body;
        console.log(req.body);
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
    app.use('/graphql', graphqlHTTP.graphqlHTTP(req => (
        {
            schema: require('./graphql/graphql.schema'),
            graphiql: true
        }
    )));

    app.listen(process.env.PORT || 3000)
}
