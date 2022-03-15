const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull

} = graphql;

let User = require('../repositories/User')
let Post = require('../repositories/Post')
let Order = require('../schemas/order')
let user = new User()
let post = new Post()
let notification = require('../schemas/notifications')
let orderItem = require('../schemas/orderItem')

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        facebookToken: { type: GraphQLString },
        phone: { type: GraphQLString },
        currentLattitude: { type: GraphQLInt },
        currentLongitude: { type: GraphQLInt },
        isRider: { type: GraphQLInt },
        rating: { type: GraphQLInt },
        currentCity: { type: GraphQLString },
        id: { type: GraphQLID },
    })
})

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        itemName: { type: GraphQLString },
        images: { type: GraphQLString },
        amountProduced: { type: GraphQLInt },
        unitPrice: { type: GraphQLInt },
        tags: { type: GraphQLString },
        unitType: { type: GraphQLString },
        country: { type: GraphQLString },
        district: { type: GraphQLString },
        city: { type: GraphQLString },
        latitude: { type: GraphQLInt },
        longitude: { type: GraphQLInt },
        postedOn: { type: GraphQLInt },
        postedBy: { type: GraphQLID },
        owner: {
            type: UserType,
            resolve(parent, args) {
                return user.findOne(parent.postedBy)
            }
        }
    })
})

const NotificationType = new GraphQLObjectType({
    type: { type: GraphQLInt },
    isSeen: { type: GraphQLInt },
    recipient: { type: GraphQLID },
    relatedSchemaId: { type: GraphQLID },
    time: { type: GraphQLInt },
    message: { type: GraphQLString },
})

const OrderType = new GraphQLObjectType({
    name: "Order",
    fields: () => ({
        id: { type: GraphQLID },
        drop_lat: { type: GraphQLInt },
        drop_long: { type: GraphQLInt },
        dropLocationGeocode: { type: GraphQLString },
        buyerId: { type: GraphQLID },
        sellerId: { type: GraphQLID },
        riderId: { type: GraphQLID },
        status: { type: GraphQLInt },
        charge: { type: GraphQLInt },
        time: { type: GraphQLInt },
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

const OrderItemType = new GraphQLObjectType({
    orderId: { type: GraphQLID },
    postId: { type: GraphQLID },
    amount: { type: GraphQLInt },
    post: {
        type: PostType,
        async resolve(parent, args) {
            return await post.findOne({ _id: parent.postId })
        }
    }
})

const RootQueryType = new GraphQLObjectType({
    name: "rootQuery",
    fields: {
        getPosts: {
            type: new GraphQLList(PostType),
            args: {},
            resolve(parent, args) {
                return post.getPosts({})
            }
        },
        findUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                user.findOne({ _id: args.id })
            }
        },
        findPost: {
            type: PostType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                post.findOne({ _id: args.id })
            }
        },
        getCreatedPosts: {
            type: new GraphQLList(PostType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await post.getPosts({ postedBy: args.id })
            }
        },
        getCreatedOrders: {
            type: new GraphQLList(OrderType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Order.find({ buyerId: args.id })
            }
        },
        getReceivedOrders: {
            type: new GraphQLList(OrderType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Order.find({ sellerId: args.id })
            }
        },
        getAssignedOrders: {
            type: new GraphQLList(OrderType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Order.find({ riderId: args.id })
            }
        },
        getNotifications: {
            type: new GraphQLList(NotificationType),
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return notification.find({ recipient: args.id })
            }
        },

    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: new GraphQLObjectType({
        name: "RootMutation",
        fields: {
            createPost: {
                type: PostType,
                args: {
                    itemName: { type: GraphQLString },
                    images: { type: GraphQLString },
                    amountProduced: { type: GraphQLInt },
                    unitPrice: { type: GraphQLInt },
                    tags: { type: GraphQLString },
                    unitType: { type: GraphQLString },
                    country: { type: GraphQLString },
                    district: { type: GraphQLString },
                    city: { type: GraphQLString },
                    latitude: { type: GraphQLInt },
                    longitude: { type: GraphQLInt },
                    postedOn: { type: GraphQLInt },
                    postedBy: { type: GraphQLID },
                },
                async resolve(parent, args) {
                    return await post.createPost(args)
                }
            },
            createUser: {
                type: UserType,
                args: {
                    facebookToken: { type: GraphQLString },
                    phone: { type: GraphQLString },
                    currentLattitude: { type: GraphQLInt },
                    currentLongitude: { type: GraphQLInt },
                    isRider: { type: GraphQLInt },
                    rating: { type: GraphQLInt },
                    currentCity: { type: GraphQLString },
                },
                async resolve(parent, args) {
                    return await user.createUser(args)
                }
            },
            createOrder: {
                type: OrderType,
                args: {
                    drop_lat: { type: GraphQLInt },
                    drop_long: { type: GraphQLInt },
                    dropLocationGeocode: { type: GraphQLString },
                    buyerId: { type: GraphQLID },
                    sellerId: { type: GraphQLID },
                    riderId: { type: GraphQLID },
                    status: { type: GraphQLInt },
                    charge: { type: GraphQLInt },
                    time: { type: GraphQLInt },
                },
                async resolve(parent, args) {
                    let newOrder = new Order(args)
                    await newOrder.save()
                    return newOrder['_doc']
                }
            },
            createOrderItem: {
                type: OrderItemType,
                args: {
                    orderId: { type: GraphQLID },
                    postId: { type: GraphQLID },
                    amount: { type: GraphQLInt },
                },
                async resolve(parent, args) {
                    let newOrderItem = new orderItem(args)
                    await newOrderItem.save()
                    return newOrderItem['_doc']
                }
            },
            createNotification: {
                type: NotificationType,
                args: {
                    type: { type: GraphQLInt },
                    isSeen: { type: GraphQLInt },
                    recipient: { type: GraphQLID },
                    relatedSchemaId: { type: GraphQLID },
                    time: { type: GraphQLInt },
                    message: { type: GraphQLString },
                },
                async resolve(parent, args) {
                    let newNotification = new notification(args)
                    await newNotification.save()
                    return newNotification['_doc']
                }
            },

        }
    })
});