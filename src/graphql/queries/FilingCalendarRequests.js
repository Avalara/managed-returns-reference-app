import { gql } from '@apollo/client';

export const filingCalendarRequests = gql`
  query FilingCalendarRequests($companyId: Int!) {
    filingCalendarRequests(input: { companyId: $companyId }) {
      value {
        filingRequests {
          value {
            data {
              taxFormCode
              region
              country
            }
          }
        }
      }
    }
  }
`;
