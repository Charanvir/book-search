const { gql } = require('apollo-server-express');

const typeDefs = gql`

    input bookData {
        authors: [String!]
        bookId: String
        description: String
        title: String
        image: String
        link: String
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        authors: [String!]
        bookId: String
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(email: String!, username: String!, password: String!): Auth
        saveBook(input: bookData): User
        removeBook(bookId: String!): User
    }
`;
module.exports = typeDefs;