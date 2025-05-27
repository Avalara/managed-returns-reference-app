import { gql } from '@apollo/client';

export const verifyEFileCredentialStatus = gql`
  query VerifyEFileCredentialStatus($companyId: Int!, $jobId: Float!) {
    verifyEFileCredentialStatus(companyId: $companyId, jobId: $jobId) {
      jobId
      status
      loginSuccess
      message
    }
  }
`;

export default verifyEFileCredentialStatus;
