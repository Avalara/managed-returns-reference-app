import { gql } from '@apollo/client';

export const returnsSetUpCountries = gql`
  query ReturnsSetUpCountries($companyId: Int!) {
    returnsSetUpCountries(input: { companyId: $companyId }) {
      value {
        id
        country
        state
        description
        returns
        status
        action
      }
    }
  }
`;
