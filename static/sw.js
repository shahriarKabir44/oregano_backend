self.addEventListener('push', (e) => {
    var dat = JSON.parse(e.data.text())
    self.registration.showNotification(dat.title, {
        body: "new order!"
    })
    self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
    }).then((clients) => {
        if (clients && clients.length) {
            clients[0].postMessage({
                type: 'REPLY_COUNT',
                count: "some_message",
            });
        }
    });
})



