import { gql } from '@apollo/client';

export const regions = gql`
  query Definitions($country: String!) {
    definitions(input: { country: $country }) {
      value {
        countries {
          code
          name
          regions {
            code
            name
          }
        }
      }
    }
  }
`;
