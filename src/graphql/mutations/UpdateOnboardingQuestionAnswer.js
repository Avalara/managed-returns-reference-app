import { gql } from '@apollo/client';

export const updateOnboardingQuestionAnswer = gql`
  mutation updateOnboardingQuestionAnswer(
    $onboardingQuestionAnswerId: Float!
    $accountId: Int!
    $companyId: Int!
    $country: String!
    $region: String!
    $questionId: Float!
    $answerId: Float!
  ) {
    updateOnboardingQuestionAnswer(
      id: $onboardingQuestionAnswerId
      companyId: $companyId
      input: {
        accountId: $accountId
        answerId: $answerId
        companyId: $companyId
        country: $country
        questionId: $questionId
        region: $region
        onboardingQuestionAnswerId: $onboardingQuestionAnswerId
      }
    ) {
      onboardingQuestionAnswerId
    }
  }
`;
