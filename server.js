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
let admin = require('./schemas/admin');
const Tag = require('./schemas/tags');
const Post = require('./schemas/post');
function startExpress() {

    let app = express()
    app.use(express.json())
    app.use(cors())
    app.set('view engine', 'ejs')
    app.use(express.static('static'))

    app.use('/management', require('./routers/Management.controller'))
    app.post('/updatePushToken', (req, res) => {

        user.findByIdAndUpdate(req.body.userId, { expoPushToken: req.body.token })
            .then(data => {
                res.send({ data: 1 })
            })
    })

    app.use('/connection', require('./routers/Connection.controller'))
    app.get('/getAllTags', (req, res) => {
        Post.find({}).distinct('lowerCasedName').then(data => {

            res.send({ data: data })
        })
    })
    app.get('/getAvailableTags/:userId', (req, res) => {
        Post.find({ postedBy: req.params.userId }).distinct('lowerCasedName').then(data => {

            res.send({ data: data })
        })
    })

    app.use('/user', require('./routers/User.controller'))

    app.post('/updateUserLocation', (req, res) => {
        user.findByIdAndUpdate(req.body.userId, {
            $set: {
                locationInfo: req.body.locationInfo,
                currentLongitude: req.body.currentLongitude,
                currentLatitude: req.body.currentLatitude,
                region: req.body.region
            }
        })
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
    app.use('/ratings', require('./routers/Rating.controller'))
    app.get('/updateSeenStatus/:id', function (req, res) {
        notification.findByIdAndUpdate(req.params.id, { isSeen: 1 }).then(function (data) {
            res.send({ data: data });
        })
    })

    app.use('/posts', require('./routers/Post.controller'))

    app.use('/orders', require('./routers/Order.contoller'))
    app.use('/admin', require('./routers/Admin.controller'))
    app.use('/graphql', graphqlHTTP.graphqlHTTP(req => (
        {
            schema: require('./graphql/graphql.schema'),
            graphiql: true
        }
    )));
    app.get('/clear', async (req, res) => {
        let tags = await Tag.find({})
        let promises = []
        for (let tag of tags) {
            promises.push(findAndDelete(tag))
        }
        await Promise.all(promises)
        res.send({ data: 1 })
    })

    async function findAndDelete(tag) {
        let post = await Post.findById(tag.postId)
        if (!post) {
            await Tag.findByIdAndDelete(tag._id)
        }
    }

    app.listen(process.env.PORT || 3000)
}
