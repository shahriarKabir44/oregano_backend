const webPush = require('web-push')


const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc'
const private_key = 'eSJlzY26NrET8pybZj5IoUnpnAA4K_jWuDZ5hEy5q5M'
webPush.setVapidDetails('mailto:abc@def.com', public_key, private_key)
const admin = require('../schemas/admin')
const AdminRegion = require('../schemas/adminRegion')
const Order = require('../schemas/order')
function startSending(client, message) {
    admin.findById(client)
        .then(data => {
            webPush.sendNotification(JSON.parse(data.endpoint), JSON.stringify(message)).catch(err => console.log(err))

        })

}

function findAdminAndNotify(orderId) {
    Order.findById(orderId)
        .then(data => {
            AdminRegion.findOne({ region: data.city }).populate({
                path: "adminId"
            })
                .then((admin) => {
                    webPush.sendNotification(JSON.parse(admin.adminId.endpoint), "message").catch(err => console.log(err))

                })

        })
}

module.exports = {
    findAdminAndNotify, startSending
}