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

export const companyFundingStatus = gql`
  query Companies($companyId: Int!) {
    companies(id: $companyId) {
      value {
        fundingStatus {
          currency
          lastSigned
          recipient
          sender
          status
          documentKey
        }
      }
    }
  }
`;
export const companyRegionStatus = gql`
  query Companies($companyId: Int!) {
    companies(id: $companyId) {
      value {
        regionStatus {
          country
          region
          status
        }
      }
    }
  }
`;
