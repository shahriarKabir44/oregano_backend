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
let notification = require('./schemas/notifications')
let admin = require('./schemas/admin')
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

    app.post('/updateUserLocation', (req, res) => {
        user.findByIdAndUpdate(req.body.userId, { locationInfo: req.body.locationInfo })
            .then(data => {
                res.send({ data: 1 })
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



    app.post('/subscribe', (req, res) => {
        const subscription = req.body
        //res.status(201).json({})
        admin.findByIdAndUpdate("62462a2c8f13da92a3d3b88a", { endpoint: JSON.stringify(subscription) })
            .then(() => {
                res.send({ body: 'abcd' })
            })

    })

    app.get('/updateSeenStatus/:id', function (req, res) {
        notification.findByIdAndUpdate(req.params.id, { isSeen: 1 }).then(function (data) {
            res.send({ data: data });
        })
    })

    app.use('/posts', require('./routers/Post.controller'))

    app.use('/orders', require('./routers/Order.contoller'))

    app.use('/graphql', graphqlHTTP.graphqlHTTP(req => (
        {
            schema: require('./graphql/graphql.schema'),
            graphiql: true
        }
    )));

    app.listen(process.env.PORT || 3000)
}
