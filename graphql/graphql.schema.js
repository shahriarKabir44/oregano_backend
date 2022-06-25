const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLFloat,


} = graphql;

let orderItem = require('../schemas/orderItem')
let connection = require('../schemas/connection');
const Tag = require('../schemas/tags');
const Rating = require('../schemas/rating');

let user = require('../schemas/user')
let post = require('../schemas/post')
let tags = require('../schemas/tags')
let Order = require('../schemas/order')
let notification = require('../schemas/notifications');
const AvailableItem = require('../schemas/availableItem');

const personalInfoType = new GraphQLObjectType({
    name: "PersonalInfo",
    fields: () => ({

        name: { type: GraphQLString },
        profileImageURL: { type: GraphQLString },
        coverPhotoURL: { type: GraphQLString }
    })
})

const LocationInfoJSON = new GraphQLObjectType({
    name: "LocationInfoJSON",
    fields: () => ({
        "city": { type: GraphQLString },
        "country": { type: GraphQLString },
        "district": { type: GraphQLString },
        "isoCountryCode": { type: GraphQLString },
        "name": { type: GraphQLString },
        "postalCode": { type: GraphQLString },
        "region": { type: GraphQLString },
        "street": { type: GraphQLString },
        "subregion": { type: GraphQLString },
        "timezone": { type: GraphQLString },
    })
})

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        facebookToken: { type: GraphQLString },
        personalInfo: {
            type: personalInfoType,
            resolve(parent, args) {
                return JSON.parse(parent.facebookToken)
            }
        },
        name: { type: GraphQLString },
        expoPushToken: { type: GraphQLString },
        region: { type: GraphQLString },
        phone: { type: GraphQLString },
        currentLatitude: { type: GraphQLFloat },
        currentLongitude: { type: GraphQLFloat },
        isRider: { type: GraphQLInt },
        rating: { type: GraphQLFloat },
        currentCity: { type: GraphQLString },
        id: { type: GraphQLID },
        lastPost: {
            type: PostType,
            async resolve(parent, args) {
                let data = await post.find({ postedBy: parent.id }).sort({ postedOn: -1 }).limit(1)
                return data[0]
            }
        },
        locationInfo: { type: GraphQLString },
        locationInfoJson: {
            type: LocationInfoJSON,
            resolve(parent, args) {
                return JSON.parse(parent.locationInfo)
            }
        }
    })
})

const AvailableItemType = new GraphQLObjectType({
    name: "AvailableItem",
    fields: () => ({
        userId: { type: GraphQLID },
        tag: { type: GraphQLString },
        day: { type: GraphQLFloat },
        rating: { type: GraphQLInt },
        unitPrice: { type: GraphQLFloat },
        ratedBy: { type: GraphQLFloat },
        lowerCasedName: {
            type: GraphQLString,
            resolve(parent, args) {
                return parent.tag
            }
        },
        region: { type: GraphQLString },

        itemName: {
            type: GraphQLString,
            resolve(parent, args) {
                return parent.tag
            }
        },
        vendor: {
            type: UserType,
            resolve(parent, args) {
                return user.findById(parent.userId)
            }
        },
        relatedPost: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return post.find({ lowerCasedName: parent.tag })
            }
        },
        getLastPost: {
            type: PostType,
            async resolve(parent, args) {
                let data = await post.find({ lowerCasedName: parent.tag }).sort({ postedOn: -1 }).limit(1)
                return data[0]
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        itemName: { type: GraphQLString },
        images: { type: GraphQLString },
        latitude: { type: GraphQLFloat },
        longitude: { type: GraphQLFloat },
        postedBy: { type: GraphQLID },
        amountProduced: { type: GraphQLInt },
        unitPrice: { type: GraphQLInt },
        stock: { type: GraphQLInt },
        time: { type: GraphQLFloat },
        rating: { type: GraphQLInt },
        city: { type: GraphQLString },
        tags: { type: GraphQLString },
        postedOn: { type: GraphQLFloat },
        district: { type: GraphQLString },
        unitType: { type: GraphQLString },
        lowerCasedName: { type: GraphQLString },
        owner: {
            type: UserType,
            resolve(parent, args) {
                return user.findOne({ _id: parent.postedBy })
            }
        }
    })
})

const RatingType = new GraphQLObjectType({
    name: "Rating",
    fields: () => ({
        postId: { type: GraphQLID },
        ratedBy: { type: GraphQLID },
        rating: { type: GraphQLInt },
        getPost: {
            type: PostType,
            resolve(parent, args) {
                return post.findById(parent.postId)
            }
        },
        getUser: {
            type: UserType,
            resolve(parent, args) {
                return user.findById(parent.ratedBy)
            }
        }
    })
})

const ConnectionType = new GraphQLObjectType({
    name: "Connection",
    fields: () => ({
        followerId: { type: GraphQLID },
        followeeId: { type: GraphQLID },
        follower: {
            type: UserType,
            async resolve(parent, args) {
                return user.findOne({ _id: parent.followerId })
            }
        },
        followee: {
            type: UserType,
            async resolve(parent, args) {
                let x = await user.findOne({ _id: parent.followeeId })
                return x
            }
        }
    })
})

const OrderType = new GraphQLObjectType({
    name: "Order",
    fields: () => ({
        id: { type: GraphQLID },
        drop_lat: { type: GraphQLFloat },
        drop_long: { type: GraphQLFloat },
        dropLocationGeocode: { type: GraphQLString },
        buyerId: { type: GraphQLID },
        sellerId: { type: GraphQLID },
        riderId: { type: GraphQLID },
        status: { type: GraphQLInt },
        charge: { type: GraphQLFloat },
        time: { type: GraphQLFloat },
        pickupLat: { type: GraphQLFloat },
        pickupLong: { type: GraphQLFloat },
        pickupLocationGeocode: { type: GraphQLString },
        itemsCount: { type: GraphQLInt },
        isPaid: { type: GraphQLInt },
        deliveryTime: { type: GraphQLFloat },
        city: { type: GraphQLString },
        buyer: {
            type: UserType,
            async resolve(parent, args) {
                return await user.findOne({ _id: parent.buyerId })
            }
        },
        seller: {
            type: UserType,
            async resolve(parent, args) {
                return await user.findOne({ _id: parent.sellerId })
            }
        },
        rider: {
            type: UserType,
            async resolve(parent, args) {
                return await user.findOne({ _id: parent.riderId })
            }
        },
        orderedItems: {
            type: new GraphQLList(OrderItemType),
            async resolve(parent, args) {
                return await orderItem.find({ orderId: parent.id })
            }
        }
    })
})

const NotificationType = new GraphQLObjectType({
    name: "Notification",
    fields: () => ({
        type: { type: GraphQLInt },
        isSeen: { type: GraphQLInt },
        recipient: { type: GraphQLID },
        relatedSchemaId: { type: GraphQLID },
        time: { type: GraphQLFloat },
        message: { type: GraphQLString },
        id: { type: GraphQLID }
    })

})

const TagType = new GraphQLObjectType({
    name: "Tag",
    fields: () => ({
        tagName: { type: GraphQLString },
        postId: { type: GraphQLID },
        findPost: {
            type: (PostType),
            async resolve(parent, args) {
                return await post.findById(parent.postId)
            }
        }
    })
})

const OrderItemType = new GraphQLObjectType({
    name: "orderItem",
    fields: () => ({
        orderId: { type: GraphQLID },
        itemName: { type: GraphQLString },
        lowerCasedName: { type: GraphQLString },
        amount: { type: GraphQLInt },
        status: { type: GraphQLInt },
        totalPrice: { type: GraphQLInt },
        lastPost: {
            type: PostType,
            async resolve(parent, args) {
                let orderInfo = await Order.findById(parent.orderId)
                let lastPost = await post.find({
                    $and: [
                        { postedBy: orderInfo.sellerId },
                        { lowerCasedName: parent.lowerCasedName }
                    ]
                }).sort({ postedOn: -1 }).limit(1)
                if (lastPost.length) return lastPost[0]
                else return null
            }
        },
        orderDetails: {
            type: OrderType,
            resolve(parent, args) {
                return Order.findById(parent.orderId)
            }
        }
    })
})


const RootQueryType = new GraphQLObjectType({
    name: "rootQuery",
    fields: {
        searchByName: {
            type: new GraphQLList(AvailableItemType),
            args: {
                tagName: { type: GraphQLString }
            },
            resolve(parent, args) {

                return AvailableItem.find({
                    $and: [
                        { tag: { $regex: new RegExp(args.tagName.toLowerCase()) } },
                        { day: { $gte: Math.floor(((new Date()) * 1) / (24 * 3600 * 1000)) } }
                    ]
                })
            }
        },
        getItemDetails: {
            type: AvailableItemType,
            args: {
                userId: { type: GraphQLID },
                tag: { type: GraphQLString },
            },
            resolve(parent, args) {
                return AvailableItem.findOne({
                    $and: [
                        { userId: args.userId },
                        { tag: args.tag },
                        { day: { $gte: Math.floor(((new Date()) * 1) / (24 * 3600 * 1000)) } }
                    ]
                })
            }
        },
        getAllOrders: {
            type: new GraphQLList(OrderType),
            args: {
                region: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Order.find({ city: args.region }).sort({ time: -1 })
            }
        },
        getOrderInfo: {
            type: OrderType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {

                return Order.findById(args.id)
            }
        },
        getPosts: {
            type: new GraphQLList(PostType),
            args: {

            },
            resolve(parent, args) {
                return post.find({}).sort({ postedOn: -1 })
            }
        },
        getPreviousOrders: {
            type: new GraphQLList(OrderType),
            args: {
                buyerId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Order.find({ buyerId: args.buyerId }).sort({ time: -1 })
            }
        },

        getPostRatings: {
            type: new GraphQLList(RatingType),
            args: {
                ownerId: { type: GraphQLID },
                lowerCasedName: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Rating.find({
                    $and: [
                        { ownerId: args.ownerId },
                        { lowerCasedName: args.lowerCasedName }
                    ]
                })
            }
        },
        findUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await user.findOne({ _id: args.id })
            }
        },
        findPost: {
            type: PostType,
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await post.findById(args.id)
            }
        },
         

        getCreatedPosts: {
            type: new GraphQLList(PostType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await post.find({ postedBy: args.id })
            }
        },
        getCreatedOrders: {
            type: new GraphQLList(OrderType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Order.find({ buyerId: args.id }).sort({ time: -1 })
            }
        },
        getReceivedOrders: {
            type: new GraphQLList(OrderType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Order.find({ sellerId: args.id }).sort({ time: -1 })
            }
        },
        getAssignedOrders: {
            type: new GraphQLList(OrderType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Order.find({
                    $and: [
                        { riderId: args.id },
                        { status: { $gte: 3 } },
                        { status: {$lte:4 } }
                    ]
                }).sort({ time: -1 })
            }
        },
        getDeliveredOrders: {
            type: new GraphQLList(OrderType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Order.find({
                    $and: [
                        { riderId: args.id },
                        { status: { $gte: 5 } }
                    ]
                }).sort({ time: -1 })
            }
        },
        getNotifications: {
            type: new GraphQLList(NotificationType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await notification.find({ recipient: args.id }).sort({ time: -1 })
            }
        },
        searchByTags: {
            type: new GraphQLList(TagType),
            args: {
                tagName: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return await tags.find({ tagName: args.tagName })
            }
        },
        getFollowers: {
            type: new GraphQLList(ConnectionType),
            args: {
                followeeId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await connection.find({ followeeId: args.followeeId })
            }
        },
        getFollowees: {
            type: new GraphQLList(ConnectionType),
            args: {
                followerId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                let x = await connection.find({ followerId: args.followerId })
                return x
            }
        },
        findLocalUsers: {
            type: new GraphQLList(UserType),
            args: {
                region: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                let localUsers = await user.find({ region: args.region })
                let connections = await connection.find({ followerId: args.userId })
                for (let connection of connections) {
                    localUsers = localUsers.filter(user => user._id != connection.followeeId)
                }
                localUsers = localUsers.filter(user => user._id != args.userId)
                return localUsers
            }
        },
        searchUser: {
            type: new GraphQLList(UserType),
            args: {
                name: { type: GraphQLString },
                phone: { type: GraphQLString },
            },
            resolve(parent, args) {
                return user.find({
                    $and: [
                        { name: { $regex: new RegExp(args.name) } },
                        { phone: { $regex: new RegExp(args.phone) } }
                    ]
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: new GraphQLObjectType({
        name: "RootMutation",
        fields: {

            createOrderItem: {
                type: OrderItemType,
                args: {
                    orderId: { type: GraphQLID },
                    itemName: { type: GraphQLString },
                    lowerCasedName: { type: GraphQLString },
                    amount: { type: GraphQLInt },
                    totalPrice: { type: GraphQLInt }

                },
                async resolve(parent, args) {
                    let newOrderItem = new orderItem({ ...args, status: 1 })
                    await newOrderItem.save()
                    return newOrderItem
                }
            },
            createNotification: {
                type: NotificationType,
                args: {
                    type: { type: GraphQLInt },
                    isSeen: { type: GraphQLInt },
                    recipient: { type: GraphQLID },
                    relatedSchemaId: { type: GraphQLID },
                    time: { type: GraphQLFloat },
                    message: { type: GraphQLString },
                },
                async resolve(parent, args) {
                    let newNotification = new notification(args)
                    await newNotification.save()
                    return newNotification
                }
            },
            createConnection: {
                type: ConnectionType,
                args: {
                    followerId: { type: GraphQLID },
                    followeeId: { type: GraphQLID },
                },
                async resolve(parent, args) {
                    let newConnection = new connection(args)
                    await newConnection.save()
                    return newConnection
                }
            }
        }
    }),

});