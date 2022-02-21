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
        currentCity:{type:GraphQLString}
    })
})
