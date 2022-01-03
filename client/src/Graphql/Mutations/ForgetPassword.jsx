import { gql } from '@apollo/client';

const FORGET_PASSWORD = gql`
mutation ForgetPassword($email: String){
  forgetPassword(email: $email) {
    message
    success
  }
}
`

export default FORGET_PASSWORD