import { gql } from '@apollo/client';

export const LiabilityReports = gql`
  query LiabilityReports($companyId: Int!, $year: Int!, $month: Int!) {
    LiabilityReports(
      companyId: $companyId
      year: $year
      month: $month
      liabilityType: ORIGINAL
    ) {
      carryOverCredit
      stateSummary
      returnSummary
    }
  }
`;
