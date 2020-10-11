import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        savedBooks {
          authors
          description
          bookId
          image
          link
          title
        }
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook(input: BookInput!) {
    saveBook(input: BookInput) {
      _id
      username
      savedBook {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook(bookId: String!) {
    removeBook(bookId: String!) {
      _id
      savedBooks {
        bookId
      }
    }
  }
`;