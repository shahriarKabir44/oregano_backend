const { Expo } = require('expo-server-sdk')
let expo = new Expo()
async function sendPushNotification(notification) {
    let newMessage = {
        to: notification.to,
        sound: 'default',
        body: notification.message,
        data: { withSome: 'data' },
    }
    if (notification.to) {
        let chunks = expo.chunkPushNotifications([newMessage]);
        return expo.sendPushNotificationsAsync(chunks[0])

    }

}

module.exports = sendPushNotification 