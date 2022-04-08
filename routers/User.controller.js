const Facebook = require('../schemas/facebook')
const User = require('../schemas/user')
const UserController = require('express').Router()

UserController.post('/isRegistered', (req, res) => {
    Facebook.findOne({ facebookId: req.body.facebookId })
        .then(data => {
            if (data) {
                User.findById(data.userId)
                    .then(user => {
                        res.send({ data: user })
                    })
            }
            else {
                res.send({ data: 0 })
            }
        })
})


module.exports = UserController