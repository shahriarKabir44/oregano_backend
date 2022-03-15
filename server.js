const express = require('express')
require('dotenv').config()
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
require('dotenv').config()
const cluster = require('cluster');
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true })
const totalCPUs = require('os').cpus().length;

startExpress();
function startExpress() {

    let app = express()
    app.use(cors())
    app.get('/', (req, res) => {
        f().then(() => {
            res.send("data")
        })

    })
    app.use('/graphql', graphqlHTTP.graphqlHTTP(req => (
        {
            schema: require('./graphql/graphql.schema'),
            graphiql: true
        }
    )));

    app.listen(process.env.PORT || 3000)
}
const post = require('./schemas/post')
async function f() {
    let newUser = new post({
        itemName: "Burger",
        images: JSON.stringify([
            "https://www.simplyrecipes.com/thmb/gazZFx2d2vq4lq1JE-Hv2jUqRR4=/3900x2600/filters:fill(auto,1)/Simply-Recipes-Mushroom-Swiss-Burger-LEAD-10-e86ce22657bb4a11b5d4b3f4d1230fe3.jpg",

            "https://www.bora.com/fileadmin/website_content/Erleben/Cooking/55_Team_Edition/Rezeptbilder/55_TeamEdition_Canada_Halloumi-Burger.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/4/47/Hamburger_%28black_bg%29.jpg",
        ]),
        amountProduced: 4,
        unitPrice: 100,
        tags: JSON.stringify(["burger", "spicy"]),
        unitType: "Units",
        country: "Bangladesh",
        district: "Khulna",
        city: "Nirala",
        latitude: 23.44,
        longitude: 120.45,
        postedOn: 1647382179340,
        postedBy: "62310d9c4477e1111a3c4c33",

    })
    await newUser.save()
}