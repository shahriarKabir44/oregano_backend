const Rating = require('../schemas/rating')
const UserTagRating = require('../schemas/user_tag_rating')

const RatingController = require('express').Router()


async function updateratingByTags(tagname, ownerId, rating) {
    let existingData = await UserTagRating.findOne({
        $and: [
            { tagName: tagname },
            { ownerId: ownerId },
        ]
    })

    if (!existingData) {
        let newUserTagRating = new UserTagRating({
            ownerId: userId,
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

RatingController.post('/rateItem', async (req, res) => {
    let { postId, ownerId, ratedBy, tagLIst, rating } = req.body
    let newRating = new Rating({
        postId: postId,
        ratedBy: ratedBy,
        rating: rating,
    })
    let promises = [newRating.save()]
    tagLIst = JSON.parse(tagLIst)
    for (let tag of tagLIst) {
        promises.push(updateratingByTags(tag, ownerId, rating))
    }
    await Promise.all(promises)
    res.send({ data: 1 })
})

module.exports = RatingController