import { gql } from "@apollo/client";

export const LOGIN_TYPE = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
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
`;

export const ONE_TAP_JOIN = gql`
  mutation OneTap {
    oneTap {
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
`;

export const LOG_OUT = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;
