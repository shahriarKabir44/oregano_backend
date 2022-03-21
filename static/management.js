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
        $scope.isAJAXBusy = 1
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
        $scope.httpReq('/getPendingOrders')
            .then(({ data }) => {
                //$scope.data = (data.data)
                console.log(data.data);
            })
    }
});