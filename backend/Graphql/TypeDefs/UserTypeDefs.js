const { gql } = require("apollo-server-express");

const typeDefs = gql`

type UserType{
    success:Boolean!
    message:String
    user:User
}
type DefaultType{
    success:Boolean!
    message:String
}

type User{
     _id:ID!
    firstName:String!
    lastName: String!
    email: String!
    createdAt: String
    photoUrl: String!
}


input signUpInput {
    firstName:String!
    lastName: String!
    email: String!
    password: String!
    photoUrl: String!
}
input updateProfileInput {
    firstName:String
    lastName: String
    password: String
    photoUrl: String
}


type Query{
    user:UserType
}
type Mutation{
    signUp(input:signUpInput):UserType
    login(email:String password:String):UserType
    forgetPassword(email:String):DefaultType
    resetPassword(resetToken:String password:String):DefaultType
    logout:DefaultType
    updateProfile(input:updateProfileInput):UserType

}

`

module.exports = typeDefs