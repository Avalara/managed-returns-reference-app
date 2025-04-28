import { gql } from '@apollo/client';

export const nexuses = gql`
  query companies($companyId: Int!) {
    companies(id: $companyId) {
      value {
        nexus {
          companyId
          companyNexus {
            companyId
            country
            jurisName
            hasLocalNexus
          }
        }
      }
    }
    #        nexuses(
    #            input: {
    #                companyId: $companyId
    #            }
    #        ) {
    #            value {
    #                id
    #                country
    #                state
    #                description
    #                returns
    #                status
    #                action
    #            }
    #        }
  }
`;
