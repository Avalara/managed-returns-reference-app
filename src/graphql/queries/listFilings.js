import { gql } from '@apollo/client';

export const listFilings = gql`
  query listFilings(
    $companyId: String!
    $year: String!
    $month: String!
    $country: String!
    $region: String
    $formCode: String
    $filingReturnId: String
    $includeCreditDetails: Boolean
  ) {
    ListFilings(
      companyId: $companyId
      year: $year
      month: $month
      country: $country
      region: $region
      formCode: $formCode
      filingReturnId: $filingReturnId
      includeCreditDetails: $includeCreditDetails
    ) {
      value {
        filingRegions {
          country
          hasNexus
          region
          status
          returns {
            accrualType
            description
            endPeriod
            filedDate
            filingCalendarId
            filingFrequency
            filingType
            formCode
            formName
            id
            registrationId
            startPeriod
            status
            taxAuthorityId
            totalAdjustments
            totalAugmentations
            totalPayments
            type
            returnTaxDetails {
              nonTaxableAmount
              numberOfNights
              salesAmount
              taxAmount
              taxType
            }
            returnTaxSummary {
              collectAmount
              nonTaxableAccrualAmount
              nonTaxableAmount
              remittanceAmount
              reportableNonTaxableAmount
              reportableSalesAmount
              reportableTaxAmount
              reportableTaxableAmount
              salesAccrualAmount
              salesAmount
              taxAccrualAmount
              taxAmount
              taxableAccrualAmount
              taxableAmount
            }
          }
          regionTaxSummary {
            collectAmount
            nonTaxableAccrualAmount
            nonTaxableAmount
            remittanceAmount
            reportableNonTaxableAmount
            reportableSalesAmount
            reportableTaxAmount
            reportableTaxableAmount
            salesAccrualAmount
            salesAmount
            taxAccrualAmount
            taxAmount
            taxableAccrualAmount
            taxableAmount
          }
          suggestReturns {
            country
            region
            returnName
            taxAuthorityId
            taxFormCode
          }
          regionTaxDetails {
            nonTaxableAmount
            numberOfNights
            salesAmount
            taxAmount
            taxType
          }
        }
        taxSummary {
          collectAmount
          nonTaxableAccrualAmount
          nonTaxableAmount
          remittanceAmount
          reportableNonTaxableAmount
          reportableSalesAmount
          reportableTaxAmount
          reportableTaxableAmount
          salesAccrualAmount
          salesAmount
          taxAccrualAmount
          taxAmount
          taxableAccrualAmount
          taxableAmount
        }
        month
        year
      }
    }
  }
`;
