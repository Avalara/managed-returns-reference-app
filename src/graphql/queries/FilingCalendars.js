import { gql } from '@apollo/client';

export const filingCalendars = gql`
  query FilingCalendars($companyId: Int!) {
    filingCalendars(input: { companyId: $companyId }) {
      value {
        filingCalendars {
          value {
            effectiveDate
            endDate
            filingFrequencyId
            filingTypeId
            formRegion
            formCountry
            id
            returnName
            stateRegistrationId
            taxFormCode
          }
        }
      }
    }
  }
`;
