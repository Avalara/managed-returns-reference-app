import { gql } from '@apollo/client';

export const Companies = gql`
  query Companies($accountId: Int!) {
    Companies(accountId: $accountId) {
      recordsetCount
      value {
        CompanyId
      }
    }
  }
`;
