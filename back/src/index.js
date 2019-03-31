const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const query = require('./resolvers/query')
const mutation = require('./resolvers/mutation')
const user = require('./resolvers/user')
const article = require('./resolvers/article')
const comment = require('./resolvers/comment')
const subscription = require('./resolvers/subscription')

const resolvers = {
  Query: {
    info: () => `This is the API of robjinman.com. Hello.`,
    ...query
  },

  Mutation: mutation,
  Subscription: subscription,
  User: user,
  Article: article,
  Comment: comment,
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
