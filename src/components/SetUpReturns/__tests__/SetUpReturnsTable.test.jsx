import {nexuses} from '../../../graphql/queries/Nexuses.js';
import {render, screen} from '@testing-library/react';
import {MockedProvider} from "@apollo/client/testing";
import SetUpReturnsTable from "../SetUpReturnsTable.jsx";

const mocks = [
  {
    request: {
      query: nexuses,
      variables: {
        companyId: 1
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
              description: 'You collect tax here',
              returns: '0 returns set up',
              status: 'Not started',
              action: ['Set up returns', 'Mark as completed']
            },
            {
              id: '2',
              country: 'US',
              state: 'California',
              description: 'You collect tax here',
              returns: '2 returns set up',
              status: 'In progress',
              action: ['Set up returns', 'Mark as completed']
            },
            {
              id: '3',
              country: 'US',
              state: 'Florida',
              description: 'You collect tax here',
              returns: '3 returns set up',
              status: 'Completed',
              action: ['Set up returns']
            },
            {
              id: '4',
              country: 'US',
              state: 'Georgia',
              description: 'You collect tax here',
              returns: '10 returns set up',
              status: 'Completed',
              action: ['Set up returns']
            },
            {
              id: '5',
              country: 'US',
              state: 'Hawaii',
              description: 'You collect tax here',
              returns: '2 returns set up',
              status: 'In progress',
              action: ['Set up returns', 'Mark as completed']
            },
            {
              id: '6',
              country: 'US',
              state: 'Idaho',
              description: 'You collect tax here',
              returns: '0 returns set up',
              status: 'Not started',
              action: ['Set up returns', 'Mark as completed']
            },
          ],
        },
      }
    },
  },
];

describe('SetUpReturnsTable', () => {
  it('renders table with pagination defaulted to 5 records per page', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SetUpReturnsTable companyId={1}/>
      </MockedProvider>
    );

    // Wait for the data to load
    await screen.findByText('Alabama');

    // Verify first page shows first 5 states
    expect(screen.getByText('Alabama')).toBeInTheDocument();
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('Florida')).toBeInTheDocument();
    expect(screen.getByText('Georgia')).toBeInTheDocument();
    expect(screen.getByText('Hawaii')).toBeInTheDocument();

    // Verify sixth state is not visible on first page
    expect(screen.queryByText('Idaho')).not.toBeInTheDocument();
  });

  it('renders error state when query fails', async () => {
    const errorMock = [
      {
        request: {
          query: nexuses,
          variables: {
            companyId: 1
          },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <SetUpReturnsTable companyId={1}/>
      </MockedProvider>
    );

    // Wait for error message to appear
    const errorAlert = await screen.findByText(
      'We are having a momentary issue. Please try again in sometime.'
    );
    expect(errorAlert).toBeInTheDocument();
  });

  it('renders table with correct data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SetUpReturnsTable companyId={1}/>
      </MockedProvider>
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
    expect(screen.getByText('Florida')).toBeInTheDocument();
    expect(screen.getByText('Georgia')).toBeInTheDocument();
    expect(screen.getByText('Hawaii')).toBeInTheDocument();

    // Verify that the sixth state (Idaho) is not shown due to pagination
    expect(screen.queryByText('Idaho')).not.toBeInTheDocument();

    // Verify other cell contents
    const descriptions = screen.getAllByText('You collect tax here');
    expect(descriptions).toHaveLength(5);

    // Verify Status column content
    expect(screen.getByText('Not started')).toBeInTheDocument();
    expect(screen.getAllByText('In progress')).toHaveLength(2);
    expect(screen.getAllByText('Completed')).toHaveLength(2);

    // Verify Action column content
    expect(screen.getAllByText('Set up returns')).toHaveLength(5);
    expect(screen.getAllByText('Mark as completed')).toHaveLength(3);
  });
});