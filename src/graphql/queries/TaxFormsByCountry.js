import { gql } from '@apollo/client';

export const taxFormsByCountry = gql`
  query taxFormsByCountry($country: String!) {
    taxForms(country: $country) {
      value {
        description
        taxFormName
        taxFormCode
        taxTypes
        purpose
        taxAuthority
        country
        region
      }
    }
  }
`;
