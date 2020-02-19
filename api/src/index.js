const { GraphQLServer } = require("graphql-yoga")
const { prisma } = require("./generated/prisma-client")
const Query = require("./resolvers/Query")
const Mutation = require("./resolvers/Mutation")
const Company = require("./resolvers/Company")
const { populateDb, clearDb } = require("./fixtures")
const User = require("./resolvers/User")

const resolvers = {
  Query,
  Mutation,
  Company,
  User,
}

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})
server.start({
  port: process.env.PORT,
  cors: {
    credentials: true,
    origin: [process.env.FRONT_URL],
  },
}, async () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
  await clearDb()
  await populateDb()
})
