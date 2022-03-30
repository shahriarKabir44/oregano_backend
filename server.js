const express = require('express')
require('dotenv').config()
const webPush = require('web-push')
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
require('dotenv').config()
const cluster = require('cluster');




const mongoose = require('mongoose')

const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc'
const private_key = 'eSJlzY26NrET8pybZj5IoUnpnAA4K_jWuDZ5hEy5q5M'


mongoose.connect(process.env.mongodb_local,
    { useNewUrlParser: true, useUnifiedTopology: true })
const totalCPUs = require('os').cpus().length;
webPush.setVapidDetails('mailto:abc@def.com', public_key, private_key)
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
let notification = require('./schemas/notifications');
const Post = require('./schemas/post');
const path = require('path')
function startExpress() {
    let clients = []
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

    app.get('/management/rider_assignment', (req, res) => {
        res.render('rider_assignment.ejs')
    })



    app.get('/getRiderList', (req, res) => {
        user.find({ isRider: 1 })
            .then(riderList => {
                res.send({ data: riderList });
            })

    })

    app.post('/assignRider', async (req, res) => {
        console.log(req.body);
        let data = await order.findByIdAndUpdate(req.body.orderId, { riderId: req.body.riderId })
        res.send({ data: data });
    })

    app.post('/subscribe', (req, res) => {
        const subscription = req.body
        clients.push(JSON.stringify(subscription))
        console.log(subscription);
        //res.status(201).json({})
        res.send({ body: 'abcd' })
    })

    app.use('/posts', require('./routers/Post.controller'))


    app.get('/getPendingOrders', (req, res) => {
        order.find({ $and: [{ status: 1 }, { riderId: null }] })
            .then(data => {
                res.send({ data: data })
            })
    })
    app.get('/acceptOrder/:orderId', (req, res) => {
        order.findByIdAndUpdate(req.params.orderId, { status: 1 })
            .then(data => {
                startSending()
                return data

            })
            .then(next => {
                res.send({ data: "done" })
            })
    })
    app.post('/createNewOrder', async (req, res) => {
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
    app.use('/graphql', graphqlHTTP.graphqlHTTP(req => (
        {
            schema: require('./graphql/graphql.schema'),
            graphiql: true
        }
    )));
    function startSending() {
        webPush.sendNotification({
            endpoint: 'https://fcm.googleapis.com/fcm/send/cAQyTIMpLP8:APA91bErEpeI9Bcqh7c6rlIRMIIAj_n2yHn7jyJEOkzp4STB9zf6zy5JITkUr8v1f-diBXNPK1XsKqSpIKcXk-ELIwURBU0RM2wRth0QWdmFOe8Ql3YOcxwG6EyH62Ji0g1kDYUTQuMu',
            expirationTime: null,
            keys: {
                p256dh: 'BCV8yKNWiwKCov1MbfpZrnnbGlQ8AXErSPJAPgx4o3prJMpJO2RaWh8SobnEC1s19XaJ1QOsk_trWnICHZQqta4',
                auth: 'qfdiwjEuVyaPsuRM_BEcCw'
            }
        }).catch(err => console.log(err))

    }
    app.listen(process.env.PORT || 3000)
}
