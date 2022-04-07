var app = angular.module('myApp', []);

app.controller('myController', function ($scope, $http) {
    $scope.orders = [];
    $scope.selectedOrder = -1
    $scope.currentOrderId = -1
    $scope.takeAction = (orderStatus, orderId) => {
        $scope.getOrderInfo(orderId)
        if (orderStatus == 1) {
            $scope.getRiders()
            $('#riderAssignmentModal').modal('show');
        }
        else if (orderStatus == 5 || orderStatus == 2 || orderStatus == 3 || orderStatus == 4 || orderStatus == 6) {
            $('#orderDetailsModal').modal('show');
        }

    }

    $scope.onInit = function () {
        $scope.fetchAllOrders()
    }

    $scope.fetchAllOrders = () => {
        $http({
            method: 'GET',
            url: '/management/getAllOrders'
        })
            .then((data) => {
                console.log(data.data.data)
                for (let order of data.data.data) {
                    order.orderTime = (new Date(order.time)).toLocaleTimeString() + ',' + (new Date(order.time)).toLocaleDateString()
                    if (order.status == 1) {
                        order.statusText = "Pending rider"
                        order.actionText = "Assign rider"
                    }
                    else if (order.status == 3) {
                        order.statusText = "Pending pickup"
                        order.actionText = "View details"
                    }
                    else if (order.status == 2) {
                        order.statusText = "Rejected"
                        order.actionText = "View details"
                    }
                    else if (order.status == 4) {
                        order.statusText = "Pending delivery"
                        order.actionText = "View details"
                    }
                    else if (order.status == 5) {
                        order.statusText = "Pending payment"
                        order.actionText = "View details"
                    } else if (order.status == 6) {
                        order.statusText = "Paid"
                        order.actionText = "View details"
                    }
                }
                $scope.orders = (data.data.data)
            }, (failure) => {

            })
    }
    $scope.orderInfo = {
        buyerName: "",
        sellerName: "",
        pickupFrom: "",
        dropTo: "",

    }
    $scope.getOrderInfo = async function (orderId) {
        $scope.currentOrderId = orderId
        let { data } = await $http.post('/graphql', JSON.stringify({
            query: `query{
                getOrderInfo(id:"${orderId}"){
                    drop_lat
                    drop_long
                    dropLocationGeocode
                    pickupLat
                    pickupLong
                    pickupLocationGeocode
                    buyerId
                    sellerId
                    charge
                    status
                    deliveryTime
                    orderedItems{
                        amount
                        post{
                            id
                            itemName
                            images
                            postedOn
                            unitType
                            unitPrice
                        }
                    }
                    seller{
                        facebookToken
                        phone
                    
                    }
                    buyer{
                        facebookToken
                        phone
                    }
                    rider{
                        facebookToken
                        phone
                    }
                }
                }`
        }))
        console.log(data.data.getOrderInfo);
        let info = data.data.getOrderInfo
        info.buyer.facebookToken = JSON.parse(info.buyer.facebookToken)
        info.seller.facebookToken = JSON.parse(info.seller.facebookToken)

        $scope.$apply(() => {
            $scope.orderInfo = {
                buyerName: info.buyer.facebookToken.name,
                buyerPhone: info.buyer.phone,
                sellerName: info.seller.facebookToken.name,
                pickupFrom: info.pickupLocationGeocode,
                dropTo: info.dropLocationGeocode,
                sellerPhone: info.seller.phone,
                status: info.status
            }
            if (info.rider) {
                info.rider.facebookToken = JSON.parse(info.rider.facebookToken)
                $scope.orderInfo = {
                    ...$scope.orderInfo,
                    riderName: info.rider.facebookToken.name,
                    riderPhone: info.rider.phone
                }
            }
            if (info.status >= 5) {
                info.deliveryTime = `${(new Date(info.deliveryTime).toLocaleTimeString())}, ${(new Date(info.deliveryTime).toLocaleDateString())}`
                $scope.orderInfo = {
                    ...$scope.orderInfo,
                    deliveryTime: info.deliveryTime
                }
            }
            if (info.status == 1) {
                info.statusText = "Pending rider"
                info.actionText = "Assign rider"
            }
            else if (info.status == 3) {
                info.statusText = "Pending pickup"
                info.actionText = "View details"
            }
            else if (info.status == 2) {
                info.statusText = "Rejected"
                info.actionText = "View details"
            }
            else if (info.status == 4) {
                info.statusText = "Pending delivery"
                info.actionText = "View details"
            }
            else if (info.status == 5) {
                info.statusText = "Pending payment"
                info.actionText = "View details"
            } else if (info.status == 6) {
                info.statusText = "Paid"
                info.actionText = "View details"
            }
            $scope.orderInfo = {
                ...$scope.orderInfo,
                statusText: info.statusText,
                actionText: info.actionText
            }
            console.log($scope.orderInfo);
        })

    }




    $scope.markPaid = function () {
        $scope.currentOrderId
        $http.post('/management/markPaid', JSON.stringify({
            orderId: $scope.currentOrderId
        }))
            .then(({ data }) => {
                for (let order of $scope.orders) {
                    if (order._id == $scope.currentOrderId) {
                        $scope.status = 6
                        order.statusText = "Paid"
                        order.actionText = "View details"
                        break
                    }
                }
            })
    }



    //rider assignment section 

    $scope.riderList = []

    $scope.getRiders = async function () {
        let { data } = await $http.get('http://localhost:3000/getRiderList')
        for (let rider of data.data) {
            rider.facebookToken = JSON.parse(rider.facebookToken)
            rider.locationInfo = JSON.parse(rider.locationInfo)
            let locationInfo = `${rider.locationInfo.city}, ${rider.locationInfo.district}, ${rider.locationInfo.subregion}, ${rider.locationInfo.region} `
            rider.currentPlace = locationInfo
        }
        console.log(data.data)
        $scope.$apply(() => {
            $scope.riderList = data.data
        })
    }


    $scope.assignRider = function (riderId) {
        $http.post('http://localhost:3000/orders/assignRider', JSON.stringify({
            orderId: $scope.currentOrderId,
            riderId: riderId
        })).then(({ data }) => {
            for (let order of $scope.orders) {
                if (order._id == $scope.currentOrderId) {
                    order.status = 3
                    order.statusText = "Pending pickup"
                    order.actionText = "View details"
                    break
                }
            }
            $('#riderAssignmentModal').modal('hide')
        })
    }

});



const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc';

navigator.serviceWorker.register('serviceWorker.js', {
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