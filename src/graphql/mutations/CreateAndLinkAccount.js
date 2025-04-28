import { gql } from '@apollo/client';

export const createAndLinkAccount = gql`
  mutation createAndLinkAccount(
    $accountName: String!
    $city: String!
    $country: String!
    $line: String!
    $postalCode: String!
    $region: String!
    $email: String!
    $firstName: String!
    $lastName: String!
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
        email: $email
        firstName: $firstName
        lastName: $lastName
        taxPayerIdNumber: $taxPayerIdNumber
      }
    ) {
      clientAccountId
      clientAccountName
      firmAccountId
      firmAccountName
      firmContactEmail
      firmContactName
      id
      isDeleted
      status
    }
  }
`;
