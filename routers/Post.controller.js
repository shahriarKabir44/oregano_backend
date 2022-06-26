let PostController = require('express').Router()
const Post = require('../schemas/post')

const AvailableItem = require('../schemas/availableItem');

PostController.post('/addNewAvaialableItem', async (req, res) => {
    let { userId, tagName, unitPrice, region } = req.body
    let newDate = Math.floor((new Date()) / (24 * 3600 * 1000))
    let data = await AvailableItem.updateOne({
        $and: [
            { userId: userId },
            { tag: tagName },
            { region: region }
        ]
    }, { $set: { day: newDate, unitPrice: unitPrice, region: region } },
        { upsert: true })

    res.send({ data: data })
})

PostController.post('/removeAvailableItem', (req, res) => {
    let { userId, tagName } = req.body
    AvailableItem.findOneAndUpdate({
        $and: [
            { userId: userId },
            { tag: tagName }
        ]
    }, { $set: { day: { $inc: -1 } } }).then((datas) => {
        res.send({ data: datas })
    })
})

PostController.post('/removeTodayTags', (req, res) => {
    AvailableItem.updateMany({ userId: req.body.userId }, { $set: { day: { $inc: -1 } } }, { upsert: true })
        .then(data => {
            res.send({ data: data })
        })
})

PostController.post('/updateTags', (req, res) => {
    AvailableItem.findOneAndUpdate({
        $and: [
            { userId: req.body.userId },
            { tag: req.body.tag }
        ]
    }, {
        $set: { ...req.body }
    }, { upsert: true })
        .then(data => {
            res.send({ data: 1 })
        })


})

PostController.post('/getTagsOfToday', (req, res) => {
    AvailableItem.find({
        $and: [
            { userId: req.body.userId },
            { day: { $gte: req.body.day } }
        ]
    }).then(items => {
        res.send({ data: items })
    })
})


PostController.get("/isItemAvailable/:itemName/:ownerId", (req, res) => {
    let currentDay = Math.floor(((new Date()) * 1) / (24 * 3600 * 1000))
    let { itemName, ownerId } = req.params

    AvailableItem.findOne({
        $and: [
            { userId: ownerId },
            { tag: itemName },
            { day: currentDay }
        ]
    })
        .then((row, err) => {
            if (!row) {
                res.send({ data: { isAvailable: 0 } })
            }
            else {
                res.send({
                    data: {
                        isAvailable: 1,
                        unitPrice: row.unitPrice
                    }
                })
            }
        })
})
PostController.post('/createPost', async (req, res) => {
    let newPost = new Post(req.body)
    await newPost.save()

    res.send({ data: newPost })
})


module.exports = PostController