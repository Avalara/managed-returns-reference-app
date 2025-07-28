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
import {
  companyRegionStatus as COMPANY_REGION_STATUS,
  filingCalendarRequests as FILING_CALENDAR_REQUESTS,
  regions as REGIONS,
  companySuggestedReturns as COMPANY_SUGGESTED_RETURNS,
} from '../../../graphql/queries';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SetUpReturnsTable from '../SetUpReturnsTable.jsx';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock(import('react-router-dom'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children }) => children,
  };
});

const mocks = [
  {
    request: {
      query: COMPANY_REGION_STATUS,
      variables: {
        companyId: 1,
      },
    },
    result: {
      data: {
        companies: {
          value: [
            {
              regionStatus: [
                {
                  country: 'US',
                  region: 'AL',
                  status: 'NOTSTARTED',
                },
                {
                  country: 'US',
                  region: 'CA',
                  status: 'INPROGRESS',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: FILING_CALENDAR_REQUESTS,
      variables: {
        companyId: 1,
        filter:
          "filingRequestStatusId eq 'CHANGEREQUEST' or filingRequestStatusId eq 'REQUESTAPPROVED'",
      },
    },
    result: {
      data: {
        filingCalendarRequests: {
          value: {
            filingRequests: {
              value: [
                {
                  companyId: 1,
                  filingRequestStatusId: 'CHANGEREQUEST',
                  id: 1,
                  data: {
                    effDate: '2023-01-01',
                    endDate: '2023-12-31',
                    filingFrequencyId: 'MONTHLY',
                    region: 'CA',
                    country: 'US',
                    returnName: 'California Sales Tax',
                    taxFormCode: 'TEST-001',
                  },
                },
                {
                  companyId: 1,
                  filingRequestStatusId: 'REQUESTAPPROVED',
                  id: 2,
                  data: {
                    effDate: '2023-01-01',
                    endDate: '2023-12-31',
                    filingFrequencyId: 'MONTHLY',
                    region: 'HI',
                    country: 'US',
                    returnName: 'Hawaii Sales Tax',
                    taxFormCode: 'TEST-002',
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: COMPANY_SUGGESTED_RETURNS,
      variables: {
        companyId: 1,
        country: 'US',
      },
    },
    result: {
      data: {
        companies: {
          value: [
            {
              suggestedTaxForms: [
                {
                  region: 'CA',
                  suggestedReturns: [
                    {
                      taxFormCode: 'TEST-001',
                    },
                  ],
                },
                {
                  region: 'HI',
                  suggestedReturns: [
                    {
                      taxFormCode: 'TEST-002',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: REGIONS,
      variables: {
        country: 'US',
      },
    },
    result: {
      data: {
        definitions: {
          value: {
            countries: [
              {
                code: 'US',
                name: 'United States',
                regions: [
                  {
                    code: 'AL',
                    name: 'Alabama',
                  },
                  {
                    code: 'CA',
                    name: 'California',
                  },
                  {
                    code: 'FL',
                    name: 'Florida',
                  },
                  {
                    code: 'GA',
                    name: 'Georgia',
                  },
                  {
                    code: 'HI',
                    name: 'Hawaii',
                  },
                  {
                    code: 'ID',
                    name: 'Idaho',
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
];

describe('SetUpReturnsTable', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders error state when query fails', async () => {
    const errorMock = [
      {
        request: {
          query: COMPANY_REGION_STATUS,
          variables: {
            companyId: 1,
          },
        },
        error: new Error('An error occurred'),
      },
      {
        request: {
          query: FILING_CALENDAR_REQUESTS,
          variables: {
            companyId: 1,
            filter:
              "filingRequestStatusId eq 'CHANGEREQUEST' or filingRequestStatusId eq 'REQUESTAPPROVED'",
          },
        },
        error: new Error('An error occurred'),
      },
      {
        request: {
          query: COMPANY_SUGGESTED_RETURNS,
          variables: {
            companyId: 1,
            country: 'US',
          },
        },
        error: new Error('An error occurred'),
      },
      {
        request: {
          query: REGIONS,
          variables: {
            country: 'US',
          },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <BrowserRouter>
        <MockedProvider mocks={errorMock} addTypename={false}>
          <SetUpReturnsTable companyId="1" />
        </MockedProvider>
      </BrowserRouter>
    );

    // Wait for error message to appear
    const errorAlert = await screen.findByText(
      'We are having a momentary issue. Please try again in sometime.'
    );
    expect(errorAlert).toBeInTheDocument();
  });

  it('renders table with correct data', async () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SetUpReturnsTable companyId="1" />
        </MockedProvider>
      </BrowserRouter>
    );

    // Verify column headers
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Returns')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();

    // Wait for and verify data
    const alabama = await screen.findByText('Alabama');
    const california = await screen.findByText('California');
    const hawaii = await screen.findByText('Hawaii');

    expect(alabama).toBeInTheDocument();
    expect(california).toBeInTheDocument();
    expect(hawaii).toBeInTheDocument();

    // Verify descriptions - should show "You collect tax here" for regions in regionStatus (AL, CA)
    const collectTaxDescriptions = screen.getAllByText('You collect tax here');
    expect(collectTaxDescriptions).toHaveLength(2); // AL and CA

    // Verify "You have not added this region" for regions only in filing data (HI)
    const notAddedDescriptions = screen.getAllByText(
      'You have not added this region'
    );
    expect(notAddedDescriptions).toHaveLength(1); // HI

    // Verify returns count text
    const returnsText = screen.getAllByText(/returns set up/);
    expect(returnsText.length).toBeGreaterThan(0);

    // Verify status badges
    const notStartedBadge = screen.getByText('Not started');
    expect(notStartedBadge).toBeInTheDocument(); // Alabama

    // Check for completed status (Hawaii and California should be completed since they have both filing request and suggested return)
    const completedBadges = screen.getAllByText('Completed');
    expect(completedBadges).toHaveLength(2); // Both CA and HI should be completed based on the logic
  });

  it('navigates to the correct route when action link is clicked', async () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SetUpReturnsTable companyId="1" />
        </MockedProvider>
      </BrowserRouter>
    );

    // Wait for the data to load
    await screen.findByText('Alabama');

    // Find and click the "Set up returns" link for Alabama
    const setupReturnsLinks = screen.getAllByText('Set up returns');
    fireEvent.click(setupReturnsLinks[0]);

    // Verify navigation was called with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith(
      '/returns/set-up-returns/Alabama?regionCode=AL&countryCode=US'
    );
  });
});
