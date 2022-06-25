self.addEventListener('push', (e) => {
    console.log(e);
    // self.clients.matchAll({
    //     includeUncontrolled: true,
    //     type: 'window',
    // }).then((clients) => {
    //     if (clients && clients.length) {
    //         clients[0].postMessage({
    //             type: "ifiw"
    //         });
    //     }
    // });

    self.registration.showNotification("dat.title", {
        body: "dat.body",
        icon: 'https://firebasestorage.googleapis.com/v0/b/pqrs-9e8eb.appspot.com/o/coverPhotos%2F6233763287e53dc7547b702c?alt=media&token=da856c14-12e0-42cf-8936-8be227dada4f',
    })
    self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
    }).then((clients) => {
        if (clients && clients.length) {
            // Send a response - the clients
            // array is ordered by last focused
            clients[0].postMessage({
                type: 'REPLY_COUNT',
                count: "xnxx",
            });
        }
    });
})



