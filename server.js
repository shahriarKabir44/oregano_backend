const express = require('express')
require('dotenv').config()
const webPush = require('web-push')
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
require('dotenv').config()
const cluster = require('cluster');
const fs = require('fs')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './ups');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

let upload = multer()
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
    app.post('/updatePostImages', (req, res) => {
        Post.findByIdAndUpdate(req.body.postId, { images: req.body.images })
            .then(data => {
                res.send({ data: 1 })
            })
    })
    app.post('/upload', upload.array(), (req, res) => {
        let { postid, postedby, postedon, type, filename } = req.headers
        let dir = `${__dirname}/static/upload/${postedby}/${postedon}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFile(__dirname + `/static/upload/${postedby}/${postedon}/${filename}.${type}`, req.body.file.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/jpg;base64,/, "").replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
            if (err) console.log(err);
            res.send({ data: `http://192.168.43.90:3000/upload/${postedby}/${postedon}/${filename}.${type}` });

        });
        //res.send({ data: "test" })
    })

    app.post('/subscribe', (req, res) => {
        const subscription = req.body
        clients.push(JSON.stringify(subscription))
        //res.status(201).json({})
        res.send({ body: 'abcd' })
    })

    app.post('/createPost', async (req, res) => {
        let newPost = new Post(req.body)
        await newPost.save()
        res.send({ data: newPost })
    })

    app.get('/getPendingOrders', (req, res) => {
        order.find({ status: 1 })
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
        webPush.sendNotification(JSON.parse('{"endpoint":"https://fcm.googleapis.com/fcm/send/dC_7cF1HIXY:APA91bEyD1IOvc9a96gK9K43361sLQZ8Wy_kMJ2jOUDAkawXMOMKxL_YF79W3Yn2PCvbjco7G1ASAMZvGud2ATz-yBJxDEcRZBTQ-iKobt1OTDpgwyIi8dYXfHqr4tOxDCWxw2kI3qro","expirationTime":null,"keys":{"p256dh":"BOHs1hmlckOURbrgmGFwsClG9QF4NCArF6yYKtnZsviNhxi7BNUGvIPaJP9DeMmv7C7w4a7mCD3RWMFFlgp0udU","auth":"DY5lPUcw8w8h6Jeb8MMMhQ"}}'), JSON.stringify({ title: 'New Order placed!' }))
            .catch(err => console.log(err))

    }
    app.listen(process.env.PORT || 3000)
}
