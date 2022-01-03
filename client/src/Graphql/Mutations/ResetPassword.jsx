import { gql } from '@apollo/client';

const RESET_PASSWORD = gql`
mutation ResetPassword($resetToken: String, $password: String){
  resetPassword(resetToken: $resetToken,password: $password) {
    message
    success
  }
}

`

export default RESET_PASSWORD