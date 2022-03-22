var app = angular.module('myApp', []);

app.controller('myController', function ($scope, $http) {
    $scope.orders = [{
        buyerId: "6233763287e53dc7547b702c",
        charge: 30,
        dropLocationGeocode: "1600, Amphitheatre Parkway, 94043, Mountain View",
        drop_lat: 37.4217493,
        drop_long: -122.0841513,
        pickupLat: 37.413200093902745,
        pickupLocationGeocode: "716 Sierra Vista Ave",
        pickupLong: -122.0894346133671,
        riderId: null,
        sellerId: "6236374dcf2e2a30d240b3c6",
        status: 1,
        time: 1647881697112,
        __v: 0,
        _id: "6238df5fb24e5846d5781542"
    }];
    $scope.httpReq = (url, toSend) => {
        var req = {
            method: toSend ? 'POST' : 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'authorization': `bearer ${localStorage.getItem('token')}`
            },
            data: toSend
        }
        return $http(req)

    }
    $scope.onInit = function () {
        $http({
            method: 'GET',
            url: '/getPendingOrders'
        })
            .then((data) => {
                $scope.orders = (data.data.data)
                console.log(data.data.data);
            }, (failure) => {

            })
    }
});


const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc';

navigator.serviceWorker.register('sw.js', {
    scope: '/',
})

navigator.serviceWorker.ready.then(async (register) => {
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertToUnit8Array(public_key),
    })
    var tm = await fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
})




navigator.serviceWorker.onmessage = (event) => {
    console.log(event);
    // location.reload(true)

};

/**
 * 
 * @param {string} base64str 
 */
function convertToUnit8Array(base64str) {
    const padding = '='.repeat((4 - (base64str.length % 4)) % 4)
    const base64 = (base64str + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    var outputArray = new Uint8Array(rawData.length)
    for (let n = 0; n < rawData.length; n++) {
        outputArray[n] = rawData.charCodeAt(n)
    }

    return outputArray
}