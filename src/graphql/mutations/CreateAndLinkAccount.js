import { gql } from '@apollo/client';

export const createAndLinkAccount = gql`
  mutation createAndLinkAccount(
    $accountName: String!
    $city: String!
    $country: String!
    $line: String!
    $postalCode: String!
    $region: String!
    $taxPayerIdNumber: String!
  ) {
    createAndLinkAccount(
      firmClientAccountInput: {
        accountName: $accountName
        companyAddress: {
          city: $city
          country: $country
          line: $line
          postalCode: $postalCode
          region: $region
        }
        taxPayerIdNumber: $taxPayerIdNumber
      }
    ) {
      clientAccountId
      clientAccountName
      firmAccountId
      firmAccountName
      id
      isDeleted
      status
    }
  }
`;
