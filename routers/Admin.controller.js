const jwt = require('jsonwebtoken')
const router = require('express').Router()
const Admin = require('../schemas/admin')
function verifyAuthToken(req, res, next) {
    var authHeader = req.headers['token']
    var token = authHeader && authHeader.split(' ')[1]
    if (!token) res.send({ data: null })
    else {
        jwt.verify(token, process.env.secret, (err, user) => {
            if (err) {
                res.send({
                    data: null
                })
            }
            else {
                req.user = user
                next()
            }
        })
    }
}

router.post('/updateEndPoint', (req, res) => {

})

router.get('/isAuthorized', verifyAuthToken, (req, res) => {
    res.send({
        data: {
            user: req.user
        }
    })
})

router.post('/login', async (req, res) => {
    var { phone, password, region } = req.body
    var admin = await Admin.findOne({
        $and: [
            { phone: phone },
            { password: password },
            { region: region }
        ]
    })
    if (!admin) {
        res.send({ data: null })
    }
    else {
        var newAdmin = { ...admin._doc, password: null }
        var token = jwt.sign(newAdmin, process.env.secret)
        res.send({
            data: {
                user: newAdmin,
                token: token
            }
        })
    }
})


module.exports = router