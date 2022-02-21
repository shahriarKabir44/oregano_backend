const graphqlHTTP = require('express-graphql');

const cluster = require('cluster');
const express = require('express');
const mongoose=require('mongoose')
const totalCPUs = require('os').cpus().length;
require('dotenv').config()
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,
        { useNewUrlParser: true, useUnifiedTopology: true })
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
function startExpress(){
    
    const app= express()
    app.use(express.json())
    app.use(require('cors')())
    app.listen(process.env.PORT|| 3000)

    app.use('/user',require('./routes/user.controller'))
    app.use('/post',require('./routes/post.controller'))
    app.use('/graphql'  , graphqlHTTP.graphqlHTTP(req => (
        {
            schema: require('./graphql/graphql.schema'),
            graphiql: true
        }
    )));
}