import { gql } from '@apollo/client';

export const fundingStatus = gql`
  query Companies($companyId: Int!) {
    companies(id: $companyId) {
      value {
        fundingStatus {
          documentName
          companyId
          errorMessage
          methodReturn {
            javaScript
            javaScriptReady
            method
          }
          recipient
          sender
          status
        }
      }
    }
  }
`;

// Additional values
// agreementType
// agreementVersion
// documentKey
// businessUnit
// companySource
// currency
// documentType
// domain
// javaScript
// lastPolled
// lastSigned
// requestId
// subledgerProfileId
// subscriptionType
// templateRequestId
// widgetId
