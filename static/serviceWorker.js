self.addEventListener('push', async (e) => {
    console.log(e);
    self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
    }).then((clients) => {
        if (clients && clients.length) {
            clients[0].postMessage({
                type: 'REPLY_COUNT',
                count: "abcd",
            });
        }
    });
})



