// QUERYS------------------------------------------------------

const userQuerys = require("./queries/users");
const productQuerys = require("./queries/products");

// MUTATIONS---------------------------------------------------

const userMutation = require("./mutations/users");
const productMutation = require("./mutations/products");

const rootResolvers = {
  Query: {
    ...userQuerys,
    ...productQuerys,
  },
  Mutation: {
    ...userMutation,
    ...productMutation,
  },
};
module.exports = rootResolvers;
