const express = require('express')
require('dotenv').config()
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
require('dotenv').config()
const cluster = require('cluster');
const mongoose = require('mongoose')
mongoose.connect(process.env.mongodb_local,
    { useNewUrlParser: true, useUnifiedTopology: true })
const totalCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
    });

} else {
    startExpress();
}
let tag = require('./schemas/tags')
function startExpress() {

    let app = express()
    app.use(cors())
    app.get('/getAvailableTags', (req, res) => {
        tag.find({}).distinct('tagName').then(data => {
            res.send({ data: data })
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
