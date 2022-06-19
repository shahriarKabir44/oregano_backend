let PostController = require('express').Router()
const Post = require('../schemas/post')

const AvailableItem = require('../schemas/availableItem');




PostController.post('/removeTodayTags', (req, res) => {
    AvailableItem.deleteMany({ userId: req.body.userId })
        .then(data => {
            res.send({ data: data })
        })
})

PostController.post('/updateTags', (req, res) => {
    AvailableItem.findOneAndDelete({
        $and: [
            { userId: req.body.userId },
            { day: req.body.day }
        ]
    }).then((rws) => {
        let newData = new AvailableItem({
            ...req.body,
            rating: 0,
            ratedBy: 0
        })
        newData.save()
            .then(data => {
                res.send({ data: 1 })
            })
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