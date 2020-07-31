const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/auth");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//BodyParser is needed just for POST.
const port = process.env.PORT || 4000;

const serverGraphQL = new ApolloServer({
  typeDefs,
  resolvers,
  playground: !!(process.env.NODE_ENV !== "production"),
  context: isAuth,
});
//Apply server graphql in express
serverGraphQL.applyMiddleware({ app, cors: false });

const httpServer = createServer(app);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ixgl1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    httpServer.listen({ port }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${port}${serverGraphQL.graphqlPath}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
