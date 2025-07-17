/*
 * Contents of this file was produced with a help of a code generation tool and
 * subsequently reviewed and edited by a human.
 *
 * While some of the code was created by an AI assisted service, manual adjustments
 * have been made to ensure correctness, readability, functionality and compliance
 * to Avalara's coding standards and guidelines.
 * Any future modifications should be approached with caution to avoid
 * overwriting the manual changes.
 *
 *
 * This source code is owned by Avalara Inc. Unauthorized copying of this file,
 * via any medium, is strictly prohibited. Proprietary and confidential.
 *
 * For more information, refer to the documentation or contact the development team.
 */

import { gql } from '@apollo/client';

export const filingCalendarRequestWithModel = gql`
  query FilingCalendarRequest(
    $companyId: Int!
    $taxFormCode: String
    $filingCalendarId: Int
    $filter: String
  ) {
    filingCalendarRequests(
      input: {
        companyId: $companyId
        taxFormCode: $taxFormCode
        filingCalendarId: $filingCalendarId
        filter: $filter
      }
    ) {
      value {
        filingRequests {
          value {
            companyId
            filingRequestStatusId
            #            id
            data {
              country
              region
              taxFormCode
              answers {
                answer
                filingQuestionId
                filingQuestionCode
              }
              locationCode
              filingFrequencyId
              effDate
              endDate
              companyReturnId
              taxAuthorityName
              returnName
            }
          }
        }
        filingCalendarRequestModel {
          #          id
          companyId
          filingRequestStatusId
          data {
            country
            region
            taxFormCode
            answers {
              answer
              filingQuestionId
              filingQuestionCode
            }
            locationCode
            filingFrequencyId
            effDate
            endDate
            companyReturnId
            #            isClone
            #            returnName
            #            taxAuthorityId
            #            taxAuthorityName
            #            canValidateEfileCredentails
            #            twoFactorAuthForwardEmail
            formFilingFrequencies {
              description
              filingFrequency
              filingPeriodDates {
                description
                filingDueDate
                transactionalPeriodEnd
                transactionalPeriodStart
              }
            }
            #            questions {
            #              dataType
            #              destination
            #              filingQuestionId
            #              filingQuestionCode
            #              helpText
            #              maxLength
            #              question
            #              regex
            #              required
            #              sortOrder
            #              defaultAnswer
            #            }
            #            filingMethods {
            #              filingMethod
            #              filingMethodId
            #            }
            #            expireOptions {
            #              transactionalPeriodStart
            #              transactionalPeriodEnd
            #              filingDueDate
            #              cycleName
            #            }
          }
        }
      }
    }
  }
`;
