import { gql } from '@apollo/client';

export const filings = gql`
  query filings(
    $companyId: Int!
    $year: Int!
    $month: Int!
    $country: String!
    $region: String
  ) {
    filings(
      input: {
        companyId: $companyId
        year: $year
        month: $month
        country: $country
        region: $region
      }
    ) {
      value {
        companyId
        id
        month
        type
        year
        filingRegions {
          country
          hasNexus
          region
          status
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
            adjustments {
              accountType
              amount
              filingId
              id
              isCalculated
              period
              reason
              type
            }
            payments {
              paymentAmount
              type
            }
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
        taxDetails {
          nonTaxableAmount
          numberOfNights
          salesAmount
          taxAmount
          taxType
        }
      }
    }
  }
`;
