import { gql } from '@apollo/client';

export const onboardingQuestionAnswer = gql`
    mutation onboardingQuestionAnswer(
        $accountId: Int!
        $companyId: Int!
        $country: String!
        $region: String!
        $questionId: Float!
        $answerId: Float!
        $operation: Operation!
    ) {
        onboardingQuestionAnswer(
            companyId: $companyId
            operation: $operation
            input: {
                accountId: $accountId
                answerId: $answerId
                companyId: $companyId
                country: $country
                questionId: $questionId
                region: $region
            }
        ) {
            createUpdateResult {
                accountId
                answerId
                companyId
                country
                onboardingQuestionAnswerId
                questionId
                region
            }
        }
    }
`;