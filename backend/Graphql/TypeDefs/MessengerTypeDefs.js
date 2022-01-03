const { gql } = require("apollo-server-express");


const typeDefs = gql`
 
type UserFriensdType{
  success:Boolean!
  message:String
  friends:UserFriens
}
type UserFriens{
    friendEmail:String!
    friendName: String
    photoUrl: String
    roomId:String!
}


type UserConversation{
   roomId:String!
   messages:[Message]
}
  type Message {
    _id:ID
    sender: String!
    text: String
    # emoji: String
  }
  type SubscriptionMessage {
    _id:ID
    sender: String!
    text: String
    roomId:String!
  }
 input SendMessageInput {
    roomId:String!
    sender: String!
    text: String
    # emoji: String
  }

  type Query {
    userMessenger:[UserFriensdType]

    # messeging between the friends
    userConversation(roomId:String):UserConversation
    conversationFriend(email:String):User
  }
  type Mutation {
   newConversation(email:String ):UserFriensdType
   sendMessage(input:SendMessageInput): DefaultType
  }

`;

module.exports = typeDefs