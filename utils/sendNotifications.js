const webPush = require('web-push')


const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc'
const private_key = 'eSJlzY26NrET8pybZj5IoUnpnAA4K_jWuDZ5hEy5q5M'
webPush.setVapidDetails('mailto:abc@def.com', public_key, private_key)
const admin = require('../schemas/admin')
function startSending(client, data) {
    admin.findById("62462a2c8f13da92a3d3b88a")
        .then(data => {
            webPush.sendNotification(JSON.parse(data.endpoint), "Poop").catch(err => console.log(err))

        })

}

module.exports = startSending