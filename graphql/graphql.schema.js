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
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        facebookToken: { type: GraphQLString },
        phone: { type: GraphQLString },
        currentLatitude: { type: GraphQLFloat },
        currentLongitude: { type: GraphQLFloat },
        isRider: { type: GraphQLInt },
        rating: { type: GraphQLFloat },
        currentCity: { type: GraphQLString },
        id: { type: GraphQLID },

    })
})
let User = require('../repositories/User')
let Post = require('../repositories/Post')
let orderItem = require('../schemas/orderItem')
let user = new User()
let post = new Post()
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
        currentCity: { type: GraphQLString },
        isPopular: { type: GraphQLInt },
        tags: { type: GraphQLString },
        owner: {
            type: UserType,
            resolve(parent, args) {
                return user.findOne({ _id: parent.postedBy })
            }
        }
    })
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
        time: { type: GraphQLFloat },
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
    })

})

const TagType = new GraphQLObjectType({
    name: "Tag",
    fields: () => ({
        tagName: { type: GraphQLString },
        postId: { type: GraphQLID },
        findPost: {
            type: new GraphQLList(PostType),
            async resolve(parent, args) {
                return await post.findOne({ _id: parent.postId })
            }
        }
    })
})

const OrderItemType = new GraphQLObjectType({
    name: "orderItem",
    fields: () => ({
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
                return await post.findOne({ _id: args.id })
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
        searchByTags: {
            type: TagType,
            args: {
                tagName: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return await tags.find({ tagName: parent.tagName })
            }
        }

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
                    latitude: { type: GraphQLFloat },
                    longitude: { type: GraphQLFloat },
                    postedOn: { type: GraphQLFloat },
                    postedBy: { type: GraphQLID },
                    tags: { type: GraphQLString }
                },
                async resolve(parent, args) {
                    let data = await post.createPost(args)
                    console.log(data)
                    return data
                }
            },
            createUser: {
                type: UserType,
                args: {
                    facebookToken: { type: GraphQLString },
                    phone: { type: GraphQLString },
                    currentLatitude: { type: GraphQLFloat },
                    currentLongitude: { type: GraphQLFloat },
                    isRider: { type: GraphQLInt },
                    rating: { type: GraphQLFloat },
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
                    time: { type: GraphQLFloat },
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
                    time: { type: GraphQLFloat },
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