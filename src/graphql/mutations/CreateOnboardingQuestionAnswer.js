import { gql } from '@apollo/client';

export const createOnboardingQuestionAnswer = gql`
  mutation createOnboardingQuestionAnswer(
    $accountId: Int!
    $companyId: Int!
    $country: String!
    $region: String!
    $questionId: Float!
    $answerId: Float!
  ) {
    createOnboardingQuestionAnswer(
      companyId: $companyId
      input: {
        accountId: $accountId
        answerId: $answerId
        companyId: $companyId
        country: $country
        questionId: $questionId
        region: $region
      }
    ) {
      onboardingQuestionAnswerId
    }
  }
`;
