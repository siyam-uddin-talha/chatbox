import { gql } from '@apollo/client';


const REGISTER = gql`mutation Signup($input: signUpInput) {
 signUp (input: $input) {
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
export default REGISTER