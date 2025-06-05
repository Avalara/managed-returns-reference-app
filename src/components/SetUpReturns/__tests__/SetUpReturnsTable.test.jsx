import {
  companyRegionStatus as COMPANY_REGION_STATUS,
  filingCalendarRequests as FILING_CALENDAR_REQUESTS,
  filingCalendars as FILING_CALENDARS,
  regions as REGIONS,
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
      },
    },
    result: {
      data: {
        filingCalendarRequests: {
          value: {
            filingRequests: {
              value: [
                {
                  data: {
                    country: 'US',
                    region: 'CA',
                    taxFormCode: 'TEST-001',
                  },
                },
                {
                  data: {
                    country: 'US',
                    region: 'HI',
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
      query: FILING_CALENDARS,
      variables: {
        companyId: 1,
      },
    },
    result: {
      data: {
        filingCalendars: {
          value: {
            filingCalendars: {
              value: [
                {
                  formCountry: 'US',
                  formRegion: 'CA',
                  taxFormCode: 'TEST-001',
                },
                {
                  formCountry: 'US',
                  formRegion: 'HI',
                  taxFormCode: 'TEST-002',
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
          },
        },
        error: new Error('An error occurred'),
      },
      {
        request: {
          query: FILING_CALENDARS,
          variables: {
            companyId: 1,
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
          <SetUpReturnsTable companyId={1} />
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
          <SetUpReturnsTable companyId={1} />
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
  });

  it('navigates to the correct route when action link is clicked', async () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SetUpReturnsTable companyId={1} />
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
