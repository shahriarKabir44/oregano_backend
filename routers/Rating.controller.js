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
    console.log(req.body)
    Rating.findOne({
        $and: [
            { postId: req.body.postId },
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

async function updateRating(existingData, newRating, tagList, ownerId) {
    let promises = [Rating.findByIdAndUpdate(existingData._id, { rating: newRating })]

    for (let tag of tagList) {
        promises.push((async () => {
            let existingRatingInfo = await UserTagRating.findOne({
                $and: [
                    { tagName: tag },
                    { ownerId: ownerId }
                ]
            })
            let exisitingRating = existingRatingInfo.avg_rating
            let newAvgRating = (exisitingRating - existingData.rating)
            if (!newAvgRating) newAvgRating = newRating
            else newRating /= 2
            return UserTagRating.findByIdAndUpdate(existingRatingInfo._id, { avg_rating: newAvgRating })
        })())
    }
    await Promise.all(promises)
}

async function createRating(postId, ownerId, ratedBy, tagLIst, rating) {
    let newRating = new Rating({
        postId: postId,
        ratedBy: ratedBy,
        rating: rating,
    })
    let promises = [newRating.save()]
    for (let tag of tagLIst) {
        promises.push(updateratingByTags(tag, ownerId, rating))
    }
    await Promise.all(promises)
}

RatingController.post('/rateItem', async (req, res) => {
    let { postId, ownerId, ratedBy, tagLIst, rating, itemName, userName } = req.body
    tagLIst = JSON.parse(tagLIst)
    let existingData = await Rating.findOne({
        $and: [
            { postId: postId },
            { ratedBy: ratedBy },
        ]
    })

    let promises = [(async () => {
        if (existingData) {
            await updateRating(existingData, rating, tagLIst, ownerId)
        }
        else {
            await createRating(postId, ownerId, ratedBy, tagLIst, rating)
        }
    })()]


    let newNotification = new Notification({
        type: 8,
        isSeen: 0,
        recipient: ownerId,
        relatedSchemaId: postId,
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