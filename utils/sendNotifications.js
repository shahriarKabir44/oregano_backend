const webPush = require('web-push')


const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc'
const private_key = 'eSJlzY26NrET8pybZj5IoUnpnAA4K_jWuDZ5hEy5q5M'
webPush.setVapidDetails('mailto:abc@def.com', public_key, private_key)

function startSending(client, data) {
    webPush.sendNotification({
        endpoint: 'https://fcm.googleapis.com/fcm/send/cAQyTIMpLP8:APA91bErEpeI9Bcqh7c6rlIRMIIAj_n2yHn7jyJEOkzp4STB9zf6zy5JITkUr8v1f-diBXNPK1XsKqSpIKcXk-ELIwURBU0RM2wRth0QWdmFOe8Ql3YOcxwG6EyH62Ji0g1kDYUTQuMu',
        expirationTime: null,
        keys: {
            p256dh: 'BCV8yKNWiwKCov1MbfpZrnnbGlQ8AXErSPJAPgx4o3prJMpJO2RaWh8SobnEC1s19XaJ1QOsk_trWnICHZQqta4',
            auth: 'qfdiwjEuVyaPsuRM_BEcCw'
        }
    }).catch(err => console.log(err))

}

module.exports = startSending