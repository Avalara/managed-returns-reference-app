import { gql } from '@apollo/client';

export const taxForms = gql`
  query taxForms($country: String!, $region: String!) {
    taxForms(country: $country, region: $region) {
      value {
        description
        taxFormName
        taxFormCode
        taxTypes
        purpose
        taxAuthority
      }
    }
  }
`;
