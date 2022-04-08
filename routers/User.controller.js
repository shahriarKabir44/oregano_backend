const Facebook = require('../schemas/facebook')
const OTP = require('../schemas/otp')
const User = require('../schemas/user')
const UserController = require('express').Router()
const client = require('twilio')(process.env.accountSid, process.env.authToken);

UserController.post('/isRegistered', (req, res) => {
    Facebook.findOne({ facebookId: req.body.facebookId })
        .then(data => {
            if (data) {
                User.findById(data.userId)
                    .then(user => {
                        //  user.facebookToken = JSON.parse(user.facebookToken)
                        user.id = user._id
                        res.send({ data: user })
                    })
            }
            else {
                res.send({ data: 0 })
            }
        })
})

UserController.post('/requestOTP', (req, res) => {
    User.findOne({ phone: req.body.phone })
        .then(data => {
            if (data) {
                res.send({ data: 0 })
            }
            else {
                OTP.findOne({
                    $and: [
                        { phone: req.body.phone }
                    ]
                }).then(otpData => {
                    let newOTPNumber = generateOTP()
                    if (otpData) {
                        OTP.findByIdAndUpdate(otpData._id, { $set: { otp: newOTPNumber } })
                    }
                    else {
                        let newOTP = new OTP({
                            phone: req.body.phone,
                            otp: newOTPNumber
                        })
                        newOTP.save()

                    }
                    client.messages
                        .create({
                            body: `Your account verification code is ${newOTPNumber}`,
                            messagingServiceSid: process.env.messagingServiceSid,
                            to: `+88${req.body.phone}`
                        })
                        .then(message => console.log(message.sid))
                        .done();
                    res.send({ data: 1 })
                })

            }
        })
})

UserController.post('/confirmOTP', (req, res) => {
    OTP.findOne({
        $and: [
            { phone: req.body.phone },
            { otp: req.body.otp }
        ]
    }).then(data => {
        if (!data) {
            res.send({ data: 0 })
        }
        else {
            let newUser = new User({
                phone: req.body.phone,
                facebookToken: JSON.stringify({
                    name: req.body.user.name,
                    profileImageURL: req.body.user.profileImageURL,
                    coverPhotoURL: "abcd"
                }),
                isRider: 0,

            })

            OTP.findOneAndDelete({
                $and: [
                    { phone: req.body.phone },
                    { otp: req.body.otp }
                ]
            }).then(() => {
                newUser.save()
                    .then(() => {
                        let newData = { ...newUser._doc }
                        console.log(newData);
                        let newFacebookConnection = new Facebook({
                            facebookId: req.body.facebookId,
                            userId: newData._id
                        })
                        newFacebookConnection.save()
                        newData.id = newData._id;
                        res.send({ data: newData })
                    })
            })

        }
    })
})


function generateOTP() {
    let res = ""
    for (let n = 0; n < 6; n++) {
        let tempNum = Math.floor(Math.random() * 10)
        if (!tempNum && !n) { tempNum = 0 }
        res += tempNum
    }
    return res
}

module.exports = UserController