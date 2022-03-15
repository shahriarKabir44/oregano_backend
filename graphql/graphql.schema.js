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
let order = require('../schemas/order')
let user = new User()
let post = new Post()
let notification = require('../schemas/notifications')

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
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parent, args) {
                return await post.getPosts({ postedBy: parent.id })
            }
        },
        createdOrders: {
            type: new GraphQLList(OrderType),
            async resolve(parent, args) {
                return await order.find({ buyerId: parent.id })
            }
        },
        receivedOrders: {
            type: new GraphQLList(OrderType),
            async resolve(parent, args) {
                return await order.find({ sellerId: parent.id })
            }
        },
        assignedOrders: {
            type: new GraphQLList(OrderType),
            async resolve(parent, args) {
                return await order.find({ riderId: parent.id })
            }
        },
        notifications: {
            type: new GraphQLList(NotificationType),
            async resolve(parent, args) {
                return notification.find({ recipient: parent.id })
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
        test: {
            type: GraphQLString,
            resolve(parent, args) {
                return "hit"
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType

});