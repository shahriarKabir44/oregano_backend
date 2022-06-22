const OTP = require('../schemas/otp')
const User = require('../schemas/user')
const UserController = require('express').Router()
const client = require('twilio')(process.env.accountSid, process.env.authToken);

UserController.post('/updateFacebookToken', (req, res) => {
    let { userid, facebookToken } = req.body
    User.findByIdAndUpdate(userid, { $set: { facebookToken: JSON.stringify(facebookToken) } })
        .then(data => {
            res.send({ data: 1 });
        })
})



UserController.post('/isRegistered', (req, res) => {
    User.findOne({ facebookId: req.body.facebookId })
        .then(user => {
            if (user) {
                //  user.facebookToken = JSON.parse(user.facebookToken)
                user.id = user._id
                res.send({ data: user })

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

UserController.post('/logout', (req, res) => {
    User.findByIdAndUpdate(req.body.userId, { $set: { expoPushToken: null } }).then(data => {
        res.send({ data: data })
    })

})

UserController.post('/registerRider', (req, res) => {
    User.findByIdAndUpdate(req.body.userId, { $set: { isRider: 1 } })
        .then(data => {
            res.send({ data: data })
        })
})

UserController.post('/unRegisterRider', (req, res) => {
    User.findByIdAndUpdate(req.body.userId, { $set: { isRider: 2 } })
        .then(data => {
            res.send({ data: data })
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
                name: req.body.user.name,
                facebookToken: JSON.stringify({
                    name: req.body.user.name,
                    profileImageURL: req.body.user.profileImageURL,
                    coverPhotoURL: "abcd"
                }),
                isRider: 0,
                facebookId: req.body.facebookId,
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