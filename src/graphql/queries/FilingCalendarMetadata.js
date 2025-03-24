import { gql } from '@apollo/client';

export const filingCalendarMetadata = gql`
  query filingCalendarMetadata($taxFormCode: String!) {
    definitions(input: { taxFormCode: $taxFormCode }) {
      value {
        filingCalendarMetaData {
          filingCalendarMetadata {
            customQuestions {
              dataType
              filingQuestionId
              destination
              helpText
              maxLength
              question
              regex
              required
              sortOrder
            }
            standardQuestions {
              value {
                dataType
                filingQuestionId
                destination
                helpText
                maxLength
                question
                regex
                required
                sortOrder
              }
            }
          }
        }
      }
    }
  }
`;
