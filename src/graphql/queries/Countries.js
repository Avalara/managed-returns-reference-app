import { gql } from '@apollo/client';

export const Countries = gql`
  query Countries {
    Countries {
      value {
        code
        alpha3Code
        name
        isEuropeanUnion
        addressesRequireRegion
        regions {
          countryCode
          code
          name
          classification
          streamlinedSalesTax
          isRegionTaxable
        }
        localizedNames {
          languageAlpha2Code
          languageAlpha3Code
          name
        }
      }
    }
  }
`;
