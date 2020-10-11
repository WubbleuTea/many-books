const { gql } = require('apollo-server-express')



const typeDefs = gql`
  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String): Auth
    addUser(username: String!, email: String!, password: String): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`

module.exports = typeDefs;