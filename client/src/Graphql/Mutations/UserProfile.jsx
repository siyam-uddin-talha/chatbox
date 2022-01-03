import { gql } from '@apollo/client';


const UPDATE_USER_PROFILE = gql`
mutation UpdateUserProfile($input: updateProfileInput) {
 updateProfile (input: $input) {
   success
    message
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
export default UPDATE_USER_PROFILE