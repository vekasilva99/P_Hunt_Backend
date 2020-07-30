const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    name: String
    lastName: String
    birthdate: String
    mail: String!
    password: String
    role: String!
    products: [Product!]
    createdAt: String!
    updatedAt: String!
  }

  type AuthUser {
    user: User!
    token: String!
    tokenExpiration: Int!
  }

  input UpdateUserInput {
    id: String!
    mail: String
    name: String!
    lastName: String!
    birthdate: String!
  }

  input UserInput {
    role: String!
    mail: String!
    password: String!
    name: String!
    lastName: String!
    birthdate: String!
  }

  type Product {
    _id: ID!
    user: User!
    name: String!
    description: String!
    logo: String!
    images: [String]
    link: String!
    votes: Int
    createdAt: String!
    updatedAt: String!
  }

  input ProductInput {
    user: String!
    name: String!
    description: String!
    logo: String!
    images: [String]
    link: String!
  }

  type Query {
    users: [User!]!
    allProducts: [Product!]!
    userLogin(mail: String!, password: String!, role: String!): AuthUser!
    currentUser: User
  }

  type Mutation {
    createUser(userInput: UserInput): User
    updateUser(updateInput: UpdateUserInput): User
    userLogin(mail: String!, password: String!, role: String!): AuthUser!

    createProduct(productInput: ProductInput): Product
  }
`;
