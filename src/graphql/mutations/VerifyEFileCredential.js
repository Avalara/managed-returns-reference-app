import { gql } from '@apollo/client';

export const verifyEFileCredential = gql`
  mutation VerifyEFileCredential(
    $companyId: Int!
    $input: VerifyEFileCredentialInput!
  ) {
    verifyEFileCredential(companyId: $companyId, input: $input) {
      jobId
      status
      loginSuccess
      message
    }
  }
`;

export default verifyEFileCredential;
