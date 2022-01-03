import { gql } from '@apollo/client';

export const CREATE_NEW_CONVERCATION = gql`
mutation CreateNewConvercation($email: String,) {
newConversation (email: $email) {
  message
  success
 friends{
   friendEmail
   roomId
   friendName
   photoUrl
 }
}
}

`

export const SEND_MESSAGE = gql`
mutation SendMessage($input: SendMessageInput) {
  sendMessage (input: $input) {
  message
  success
  }
}

`
