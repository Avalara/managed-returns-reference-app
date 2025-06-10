import { gql } from '@apollo/client';

export const createFirmClientLinkage = gql`
  mutation CreateFirmClientLinkage(
    $firmAccountId: Int
    $firmAccountName: String
  ) {
    createFirmClientLinkage(
      input: {
        firmAccountId: $firmAccountId
        firmAccountName: $firmAccountName
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
