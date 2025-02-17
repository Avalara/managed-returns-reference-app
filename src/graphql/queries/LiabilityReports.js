import { gql } from '@apollo/client';

export const liabilityReports = gql`
  query liabilityReports($companyId: Int!, $year: Int!, $month: Int!) {
    liabilityReports(
      companyId: $companyId
      year: $year
      month: $month
      liabilityType: ORIGINAL
    ) {
      reports
    }
  }
`;
