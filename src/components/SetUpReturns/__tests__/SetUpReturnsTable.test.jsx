import { nexuses as NEXUSES } from '../../../graphql/queries/Nexuses.js';
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
      query: NEXUSES,
      variables: {
        companyId: 1,
      },
    },
    result: {
      data: {
        nexuses: {
          value: [
            {
              id: '1',
              country: 'US',
              state: 'Alabama',
              stateCode: 'AL',
              countryCode: 'US',
              description: 'You collect tax here',
              returns: '0 returns set up',
              status: 'Not started',
              action: ['Set up returns', 'Mark as completed'],
            },
            {
              id: '2',
              country: 'US',
              state: 'California',
              stateCode: 'CA',
              countryCode: 'US',
              description: 'You collect tax here',
              returns: '2 returns set up',
              status: 'In progress',
              action: ['Set up returns', 'Mark as completed'],
            },
            {
              id: '3',
              country: 'US',
              state: 'Florida',
              stateCode: 'FL',
              countryCode: 'US',
              description: 'You collect tax here',
              returns: '3 returns set up',
              status: 'Completed',
              action: ['Set up returns'],
            },
            {
              id: '4',
              country: 'US',
              state: 'Georgia',
              stateCode: 'GA',
              countryCode: 'US',
              description: 'You collect tax here',
              returns: '10 returns set up',
              status: 'Completed',
              action: ['Set up returns'],
            },
            {
              id: '5',
              country: 'US',
              state: 'Hawaii',
              stateCode: 'HI',
              countryCode: 'US',
              description: 'You collect tax here',
              returns: '2 returns set up',
              status: 'In progress',
              action: ['Set up returns', 'Mark as completed'],
            },
            {
              id: '6',
              country: 'US',
              state: 'Idaho',
              stateCode: 'ID',
              countryCode: 'US',
              description: 'You collect tax here',
              returns: '0 returns set up',
              status: 'Not started',
              action: ['Set up returns', 'Mark as completed'],
            },
          ],
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
          query: NEXUSES,
          variables: {
            companyId: 1,
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

    expect(alabama).toBeInTheDocument();
    expect(california).toBeInTheDocument();

    // Verify other cell contents
    const descriptions = screen.getAllByText('You collect tax here');
    expect(descriptions).toHaveLength(10);
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
      'Alabama?regionCode=AL&countryCode=US',
      {
        relative: 'route',
      }
    );
  });
});
