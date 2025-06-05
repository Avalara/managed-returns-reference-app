import { gql } from '@apollo/client';

export const updateRegionStatus = gql`
  mutation UpdateRegionStatus(
    $companyId: Int!
    $input: [UpdateRegionStatusInput]!
  ) {
    updateRegionStatus(companyId: $companyId, input: $input) {
      country
      region
      status
    }
  }
`;
