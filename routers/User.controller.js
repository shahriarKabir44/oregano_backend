const Facebook = require('../schemas/facebook')
const OTP = require('../schemas/otp')
const User = require('../schemas/user')
const UserController = require('express').Router()
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const multer = require('multer');
const fs = require('fs')
const path = require('path')

const upload = multer()

UserController.post('/uploadCoverPhoto', upload.array(), (req, res) => {
    let { userid, type, filename } = req.headers
    console.log(req.headers)
    let dir = path.join(__dirname, '..', `static/userImages/${userid}`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    let newFileName = `${filename}${new Date() * 1}.${type}`
    fs.writeFile(`${dir}/${newFileName}`, req.body.file.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/jpg;base64,/, "").replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
        if (err) console.log(err);
        else {
            const newURL = `http://192.168.43.90:3000/userImages/${userid}/${newFileName}`
            User.findById(userid)
                .then(userData => {
                    console.log(userid)
                    let fbToken = JSON.parse(userData.facebookToken)
                    fbToken.coverPhotoURL = newURL
                    User.findByIdAndUpdate(userid, { $set: { facebookToken: JSON.stringify(fbToken) } })
                        .then(data => {
                            res.send({ data: newURL });
                        })
                })

        }


    });
})



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
                name: req.body.user.name,
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