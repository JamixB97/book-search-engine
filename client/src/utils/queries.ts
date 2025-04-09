import { gql } from '@apollo/client';

// This query retrieves the current user's information
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;