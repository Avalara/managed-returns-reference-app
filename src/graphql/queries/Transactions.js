import { gql } from '@apollo/client';

export const transactionImportHistory = gql`
  query transactions($companyId: Int!) {
    transactions(companyId: $companyId) {
      value {
        importHistory {
          value {
            transactionBatchId
            status
            hasErrorFile
            fileName
            importType
            createdDate
          }
        }
      }
    }
  }
`;

export const transactionBatchErrors = gql`
  query transactions($companyId: Int!, $batchId: Int!) {
    transactions(companyId: $companyId, batchId: $batchId) {
      value {
        batchErrors {
          errors {
            errorType
            transaction {
              transactionCode
              transactionDate
              country
              region
              addressLine1
              county
              city
              postalCode
              taxType
              taxLevel
              taxRate
              grossAmount
              exemptAmount
              taxableAmount
              taxAmount
            }
          }
        }
      }
    }
  }
`;
