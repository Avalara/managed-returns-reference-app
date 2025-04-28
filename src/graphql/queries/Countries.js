import { gql } from '@apollo/client';

export const countries = gql`
  query countries {
    definitions {
      value {
        countries {
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
  }
`;
