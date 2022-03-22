self.addEventListener('push', (e) => {
    var dat = JSON.parse(e.data.text())
    self.registration.showNotification(dat.title, {
        body: "new order!"
    })
    // self.clients.matchAll({
    //     includeUncontrolled: true,
    //     type: 'window',
    // }).then((clients) => {
    //     if (clients && clients.length) {
    //         clients[0].postMessage({
    //             type: 'REPLY_COUNT',
    //             count: "some_message",
    //         });
    //     }
    // });
    if (!e.clientId) return;

    // Get the client.
    const client = await clients.get(e.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    // Send a message to the client.
    client.postMessage({
        msg: "Hey I just got a fetch from you!",
        url: e.request.url
    });
})



