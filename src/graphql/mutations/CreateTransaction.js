import { gql } from '@apollo/client';

export const createTransaction = gql`
  mutation createTransaction(
    $input: [TransactionImportCreateInput]!
    $companyId: Int!
  ) {
    createTransaction(input: $input, companyId: $companyId) {
      errorMessage
      status
      transactionBatchId
    }
  }
`;
