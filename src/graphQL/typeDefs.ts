export const typeDefs = 
` 
type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
}

type AuthUser {
    token: String,
    id: String
}

input UserInput {
    name: String!
    email: String!
    password: String!
}

type Query {
    user(id: ID!): User
    userByEmail(email: String!): User
}

type Mutation {
    createUser(data: UserInput!): AuthUser!
    updateUser(data: UserInput!): User
    deleteUser: Boolean
    login(email: String!, password: String!): AuthUser
}
`
