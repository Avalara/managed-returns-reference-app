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
              filingQuestionCode
              destination
              helpText
              maxLength
              question
              regex
              required
            }
            standardQuestions {
              value {
                dataType
                filingQuestionId
                filingQuestionCode
                destination
                helpText
                maxLength
                question
                regex
                required
              }
            }
            formFilingFrequencies {
              filingFrequency
              filingFrequencyId
              filingPeriodDates {
                description
                transactionalPeriodEnd
                transactionalPeriodStart
                filingDueDate
              }
            }
            formFilingMethods {
              filingMethod
              filingMethodId
            }
            formHeader {
              outletReportingMethod
              outletReportingMethodId
              region
            }
          }
        }
      }
    }
  }
`;
