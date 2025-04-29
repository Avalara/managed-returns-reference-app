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

export const companyLocations = gql`
  query getCompanyLocations($companyId: Int!) {
    companies(id: $companyId) {
      value {
        locations {
          city
          country
          description
          isDefault
          line1
          locationCode
          postalCode
          region
        }
      }
    }
  }
`;
