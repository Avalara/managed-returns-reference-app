import { gql } from '@apollo/client';

export const taxForms = gql`
  query taxForms(
    $country: String!
    $region: String!
    $includeTaxTypes: Boolean = true
  ) {
    taxForms(
      country: $country
      region: $region
      includeTaxTypes: $includeTaxTypes
    ) {
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
