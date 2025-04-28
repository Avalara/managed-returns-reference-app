import { gql } from '@apollo/client';

export const fundingPoa = gql`
  mutation FundingPoa(
    $requestWidget: Boolean!
    $requestEmail: Boolean!
    $fundingEmailRecipient: String!
    $currency: String!
    $agreementType: String!
    $companyId: Int!
  ) {
    fundingPoa(
      input: {
        requestWidget: $requestWidget
        requestEmail: $requestEmail
        fundingEmailRecipient: $fundingEmailRecipient
        currency: $currency
        agreementType: $agreementType
      }
      companyId: $companyId
    ) {
      errorMessage
      javaScript
    }
  }
`;
