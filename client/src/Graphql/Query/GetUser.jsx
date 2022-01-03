import { gql } from '@apollo/client';

export const GET_USER = gql`
query{
  user {
    message
    success
    user {
      _id
      email
      firstName
      lastName
      photoUrl
    }
  }
}
`
