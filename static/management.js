var app = angular.module('myApp', []);

app.controller('myController', function ($scope, $http) {
    $scope.orders = [];
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
            url: '/orders/getPendingOrders'
        })
            .then((data) => {
                $scope.orders = (data.data.data)
            }, (failure) => {

            })
    }
    $scope.findRider = function (orderId) {
        localStorage.setItem('orderId', orderId)
        location.href = 'http://localhost:3000/management/rider_assignment'
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
    location.reload(true)

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