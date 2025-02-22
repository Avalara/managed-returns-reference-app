import { gql } from '@apollo/client';

export const suggestedReturns = gql`
  query suggestedReturns($companyId: Int!) {
    companies(id: $companyId) {
      value {
        suggestedReturns {
          country
          region
          onboardingQuestions {
            allowMultiSelect
            country
            dataType
            helpText
            question
            questionId
            region
            sequence
            standard
            answers {
              answer
              answerHelpText
              leadingQuestionAnswerId
              nextQuestionId
              taxFormCode
            }
          }
          suggestedReturns {
            description
            taxAuthorityId
            taxFormCode
            taxAuthorityName
            taxFormName
            taxTypes
          }
        }
      }
    }
  }
`;