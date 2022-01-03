import { gql } from '@apollo/client';


export const GET_ROOM_CONVERCATION = gql`
query UserConvercation($roomId: String) {
  userConversation (roomId: $roomId) {
    roomId
    messages{
    _id
    sender
    text
  }
  }
}

`

export const GET_USER_ROOM_FRIEND = gql`
query($email: String){
  conversationFriend(email: $email) {
    firstName
    lastName
    photoUrl
  }
}


`
