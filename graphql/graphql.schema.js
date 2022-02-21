const graphql=require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull

} = graphql;
const UserType=new GraphQLObjectType({
    name:"User",
    fields:()=>({
        facebookToken: { type: GraphQLString },
        phone: { type: GraphQLString },
        currentLattitude: { type: GraphQLInt },
        currentLongitude: { type: GraphQLInt },
        isRider: { type: GraphQLInt },
        rating: {type:GraphQLInt},
        currentCity:{type:GraphQLString},
        id:{type:GraphQLID},

    })
})
let User=  require('../repositories/User')
let Post=require('../repositories/Post')

let user=new User()
let post=new Post()
const PostType=new GraphQLObjectType({
    name:"Post",
    fields: ()=>({
        id:{type:GraphQLID},
        itemName: { type: GraphQLString },
        images: { type: GraphQLString  },
        lattitude: { type: GraphQLInt },
        longitude: { type: GraphQLInt },
        postedBy:{type: GraphQLID},
        amountProduced:{ type: GraphQLInt },
        unitPrice:{ type: GraphQLInt },
        stock:{ type: GraphQLInt },
        time:{ type: GraphQLInt },
        rating:{ type: GraphQLInt },
        currentCity:{type: GraphQLString},
        isPopular:{type:GraphQLInt},
        tags:{type:GraphQLString},
        owner: {
            type:UserType,
            resolve(parent,args){
                return user.findOne(parent.postedBy)
            }
        }
    })
})

const RootQueryType=new GraphQLObjectType({
    name:"rootQuery",
    fields:{
        getPosts:{
            type:new GraphQLList(PostType),
            args:{},
            resolve(parent,args){
                return post.getPosts({})
            }
        },
        test:{
            type:GraphQLString,
            resolve(parent,args){
                return "hit"
            }
        }
    }
})

module.exports= new GraphQLSchema({
    query: RootQueryType 
    
});