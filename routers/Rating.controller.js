const Order = require('../schemas/order')
const Rating = require('../schemas/rating')
const UserTagRating = require('../schemas/user_tag_rating')
const Notification = require('../schemas/notifications')
const RatingController = require('express').Router()
const User = require('../schemas/user')
const pushNotificationManager = require('../utils/pushNotificationManager')



async function updateratingByTags(tagname, ownerId, rating) {
    let existingData = await UserTagRating.findOne({
        $and: [
            { tagName: tagname },
            { ownerId: ownerId },
        ]
    })

    if (!existingData) {
        let newUserTagRating = new UserTagRating({
            ownerId: ownerId,
            tagName: tagname,
            avg_rating: rating
        })
        return await newUserTagRating.save()
    }
    else {
        let newRating = (existingData.avg_rating + rating) / 2
        return await UserTagRating.findByIdAndUpdate(existingData._id, { avg_rating: newRating })
    }
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

async function updateRating(existingData, newRating, ownerId) {
    let promises = [Rating.findByIdAndUpdate(existingData._id, { rating: newRating }),

    (async () => {
        let existingRatingInfo = await UserTagRating.findOne({
            $and: [
                { tagName: existingData.lowerCasedName },
                { ownerId: ownerId }
            ]
        })
        let exisitingRating = existingRatingInfo.avg_rating
        let newAvgRating = (exisitingRating - existingData.rating)
        if (!newAvgRating) newAvgRating = newRating
        else newRating /= 2
        return UserTagRating.findByIdAndUpdate(existingRatingInfo._id, { avg_rating: newAvgRating })

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
    let promises = [newRating.save(), updateratingByTags(lowerCasedName, ownerId, rating)]

    await Promise.all(promises)
}

RatingController.post('/rateItem', async (req, res) => {
    console.log(req.body);
    let { lowerCasedName, ownerId, ratedBy, rating, itemName, userName } = req.body
    let existingData = await Rating.findOne({
        $and: [
            { lowerCasedName: lowerCasedName },
            { ratedBy: ratedBy },
        ]
    })

    let promises = [(async () => {
        if (existingData) {
            await updateRating(existingData, rating, ownerId)
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

    res.send({ data: 1 })
})

RatingController.post('/getTagRatings', (req, res) => {
    UserTagRating.find({ ownerId: req.body.ownerId })
        .then(data => {
            res.send({ data: data })
        })
})

module.exports = RatingController