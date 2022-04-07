const Connection = require('../schemas/connection');
const Notification = require('../schemas/notifications');

const ConnectionController = require('express').Router();
const sendPushNotification = require('../utils/pushNotificationManager')

ConnectionController.post('/isFollowing', (req, res) => {
    Connection.findOne({
        $and: [
            { followeeId: req.body.followeeId },
            { followerId: req.body.followerId },
        ]
    }).then(data => {
        console.log(req.body)
        res.send({ data: data != null })
    })
})

ConnectionController.post('/follow', (req, res) => {
    let newConnection = new Connection({
        followeeId: req.body.followeeId,
        followerId: req.body.followerId,
    })
    let newNotification = new Notification({
        type: 9,
        isSeen: 0,
        recipient: req.body.followeeId,
        relatedSchemaId: req.body.followerId,
        time: (new Date()) * 1,
        message: `${req.body.followerName} has started to follow you!`,
    })

    newConnection.save()
    newNotification.save()
    sendPushNotification({
        to: req.body.followeeExpoToken,
        message: `${req.body.followerName} has started to follow you!`
    })

    res.send({ data: 1 })



})
ConnectionController.post('/unFollow', (req, res) => {
    Connection.findOneAndDelete({
        $and: [{ followeeId: req.body.followeeId },
        { followerId: req.body.followerId }]
    })
        .then(data => {
            res.send({ data: data })
        })


})

module.exports = ConnectionController