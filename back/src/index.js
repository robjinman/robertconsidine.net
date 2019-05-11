const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");
const s3 = require("./s3");
const query = require("./resolvers/query");
const mutation = require("./resolvers/mutation");
const user = require("./resolvers/user");
const page = require("./resolvers/page");
const article = require("./resolvers/article");
const tag = require("./resolvers/tag");
const comment = require("./resolvers/comment");
const file = require("./resolvers/file");
const subscription = require("./resolvers/subscription");
const accountActivation = require("./account_activation");
const utils = require("./utils");

const resolvers = {
  Query: {
    info: () => "This is the API of robjinman.com",
    ...query
  },

  Mutation: mutation,
  Subscription: subscription,
  User: user,
  Page: page,
  Article: article,
  Tag: tag,
  Comment: comment,
  File: file,

  Document: {
    __resolveType(obj, context, info) {
      if (obj.comments) {
        return "Article";
      }

      return "Page";
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
      s3Service: new s3.S3Service()
    }
  },
});

server.express.get("/activate", (req, res) => {
  accountActivation.processActivation(req, res, prisma);
});

server.express.get("/health", (req, res) => {
  res.send('still alive');
});

utils.createAdminUser();

const options = {
  bodyParserOptions: {
    limit: "10mb", type: "application/json"
  }
};

server.start(options, () => console.log("GraphQL server is running"));
