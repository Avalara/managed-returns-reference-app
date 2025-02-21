import { gql } from '@apollo/client';

export const companies = gql`
  query companies($accountId: Int!) {
    companies(accountId: $accountId) {
      value {
        id
      }
    }
  }
`;
