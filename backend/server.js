/*
author: Arnob Islam
date: '14-12-21' 
description: ''
*/
const express = require('express');
const app = require("./app")
const { ApolloServer, } = require('apollo-server-express');
const { createServer } = require('http')
const { makeExecutableSchema } = require('@graphql-tools/schema');
const jwt = require('jsonwebtoken');
const path = require('path');
const socket = require('./controllers/Socket.io');
const typeDefs = require('./Graphql/TypeDefs/app');
const resolvers = require('./Graphql/Resolvers/app');
const { ApolloServerPluginLandingPageDisabled } = require('apollo-server-core');


const PORT = process.env.PORT || 5000;

// render the client
app.use("*", express.static(path.join(__dirname, '../client/build')))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})


const StartServer = async () => {
    try {
        const httpServer = createServer(app)

        const getUser = token => {
            try {
                if (token) {
                    return jwt.verify(token, process.env.JWT_SECRET_KEY)
                }
                return null
            } catch (err) {
                return null
            }
        }

        const schema = makeExecutableSchema({ typeDefs, resolvers, });

        const server = new ApolloServer({
            schema,
            context: ({ req, res }) => {
                const token = req.cookies.token || ""
                const user = getUser(token)
                return { req, res, user }
            },
            plugins: [
                ApolloServerPluginLandingPageDisabled(),
            ],
        })

        await server.start()
        server.applyMiddleware({
            app,
            // in playground make sure corse is false
            // cors: false,

            // in react or client, make sure corse is this
            cors: {
                origin: 'http://localhost:3000',
                credentials: true
            }
        })

        const getServer = httpServer.listen(PORT, () => console.log('server is running on port ', + PORT))

        socket(getServer)

    } catch (error) {
        throw new Error(error.message)
    }
}

StartServer()





