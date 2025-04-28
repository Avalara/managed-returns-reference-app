import { gql } from '@apollo/client';

export const transactionImportHistory = gql`
  query transactions($companyId: Int!) {
    transactions(companyId: $companyId) {
      value {
        importHistory {
          value {
            transactionBatchId
            status
            errorMessages
            hasErrorFile
            fileName
            importFileId
            errorFileId
            importType
          }
        }
      }
    }
  }
`;
