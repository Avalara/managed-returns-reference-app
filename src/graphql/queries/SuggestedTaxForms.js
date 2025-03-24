import { gql } from '@apollo/client';

export const suggestedTaxForms = gql`
  query suggestedTaxForms(
    $companyId: Int!
    $country: String!
    $region: String!
  ) {
    companies(id: $companyId, input: { country: $country, region: $region }) {
      value {
        suggestedTaxForms {
          suggestedReturns {
            taxFormCode
          }
          answeredQuestions {
            questionId
            answerId
            onboardingQuestionAnswerId
          }
          onboardingQuestions {
            allowMultiSelect
            answers {
              answer
              answerHelpText
              leadingQuestionAnswerId
            }
            helpText
            question
            questionId
          }
        }
      }
    }
  }
`;
