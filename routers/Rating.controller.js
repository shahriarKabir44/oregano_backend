const Order = require('../schemas/order')
const Rating = require('../schemas/rating')
const Notification = require('../schemas/notifications')
const RatingController = require('express').Router()
const User = require('../schemas/user')
const pushNotificationManager = require('../utils/pushNotificationManager')

const AvailableItem = require('../schemas/availableItem')

async function updateratingByTags(tagname, ownerId, rating) {
    let existingData = await AvailableItem.findOne({
        $and: [
            { tag: tagname },
            { userId: ownerId },
        ]
    })
    return await AvailableItem.findOneAndUpdate({
        $and: [
            { tag: tagname },
            { userId: ownerId },
        ]
    }, { $set: { rating: (existingData.rating * existingData.numPeopleRated + rating) / (existingData.numPeopleRated + 1), numPeopleRated: existingData.numPeopleRated + 1 } })


}

RatingController.post('/getUserRating', (req, res) => {
    Rating.findOne({
        $and: [
            { lowerCasedName: req.body.lowerCasedName },
            { ratedBy: req.body.ratedBy }
        ]
    })
        .then(data => {
            res.send({ data: data })
        })
})

RatingController.post('/updateOrder', (req, res) => {
    Order.findByIdAndUpdate(req.body.id, { isRated: req.body.isRated })
        .then(data => {
            res.send({ data: 1 })
        })
})

async function updateRating(existingRatingData, newRating, ownerId) {
    let promises = [Rating.findByIdAndUpdate(existingRatingData._id, { rating: newRating }),

    (async () => {
        let availableItemInfo = await AvailableItem.findOne({
            $and: [
                { tag: existingRatingData.lowerCasedName },
                { userId: ownerId }
            ]
        })
        let newAvgRating = (availableItemInfo.numPeopleRated * availableItemInfo.rating - existingRatingData.rating + newRating) / availableItemInfo.numPeopleRated


        return AvailableItem.findByIdAndUpdate(availableItemInfo._id, { rating: newAvgRating })

    })()
    ]

    await Promise.all(promises)
}

async function createRating(lowerCasedName, ownerId, ratedBy, rating) {
    let newRating = new Rating({
        lowerCasedName: lowerCasedName,
        ratedBy: ratedBy,
        rating: rating,
        ownerId: ownerId
    })
    let promises = [newRating.save(),
    updateratingByTags(lowerCasedName, ownerId, rating)]

    await Promise.all(promises)
}

RatingController.post('/rateItem', async (req, res) => {
    let { lowerCasedName, ownerId, ratedBy, rating, itemName, userName } = req.body
    res.send({ data: 1 })
    let existingRatingData = await Rating.findOne({
        $and: [
            { lowerCasedName: lowerCasedName },
            { ratedBy: ratedBy },
        ]
    })

    let promises = [(async () => {
        if (existingRatingData) {
            await updateRating(existingRatingData, rating, ownerId)
        }
        else {
            await createRating(lowerCasedName, ownerId, ratedBy, rating)
        }
    })()]


    let newNotification = new Notification({
        type: 8,
        isSeen: 0,
        recipient: ownerId,
        relatedSchemaId: null,
        time: (new Date()) * 1,
        message: `${userName} has rated your ${itemName} ${rating}⭐`,
    })
    promises.push(newNotification.save())
    promises.push((async () => {
        let receiver = await User.findById(ownerId)
        let receiverToken = receiver.expoPushToken
        pushNotificationManager({
            to: receiverToken,
            message: `${userName} has rated your ${itemName} ${rating}⭐`
        })
    })())

    await Promise.all(promises)


})

RatingController.post('/getTagRatings', (req, res) => {
    AvailableItem.find({ userId: req.body.ownerId })
        .then(data => {
            res.send({ data: data })
        })
})

module.exports = RatingController