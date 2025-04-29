import { Table, Typography, Badge, Result } from 'antd';
import { useQuery } from '@apollo/client';
import { nexuses as NEXUSES } from '../../graphql/queries/Nexuses.js';
import { useNavigate } from 'react-router-dom';

const mockDataSource = [
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
    state: 'Alaska',
    stateCode: 'AK',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '3',
    country: 'US',
    state: 'Arizona',
    stateCode: 'AZ',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '4',
    country: 'US',
    state: 'Arkansas',
    stateCode: 'AR',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '5',
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
    id: '6',
    country: 'US',
    state: 'Colorado',
    stateCode: 'CO',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '7',
    country: 'US',
    state: 'Connecticut',
    stateCode: 'CT',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '2 returns set up',
    status: 'Completed',
    action: ['Set up returns'],
  },
  {
    id: '8',
    country: 'US',
    state: 'Delaware',
    stateCode: 'DE',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '9',
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
    id: '10',
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
    id: '11',
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
    id: '12',
    country: 'US',
    state: 'Idaho',
    stateCode: 'ID',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '13',
    country: 'US',
    state: 'Illinois',
    stateCode: 'IL',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '14',
    country: 'US',
    state: 'Indiana',
    stateCode: 'IN',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '15',
    country: 'US',
    state: 'Iowa',
    stateCode: 'IA',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '16',
    country: 'US',
    state: 'Kansas',
    stateCode: 'KS',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '17',
    country: 'US',
    state: 'Kentucky',
    stateCode: 'KY',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '18',
    country: 'US',
    state: 'Louisiana',
    stateCode: 'LA',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '2 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '19',
    country: 'US',
    state: 'Maine',
    stateCode: 'ME',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '20',
    country: 'US',
    state: 'Maryland',
    stateCode: 'MD',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '21',
    country: 'US',
    state: 'Massachusetts',
    stateCode: 'MA',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '3 returns set up',
    status: 'Completed',
    action: ['Set up returns'],
  },
  {
    id: '22',
    country: 'US',
    state: 'Michigan',
    stateCode: 'MI',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '2 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '23',
    country: 'US',
    state: 'Minnesota',
    stateCode: 'MN',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '24',
    country: 'US',
    state: 'Mississippi',
    stateCode: 'MS',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '25',
    country: 'US',
    state: 'Missouri',
    stateCode: 'MO',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '26',
    country: 'US',
    state: 'Montana',
    stateCode: 'MT',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '27',
    country: 'US',
    state: 'Nebraska',
    stateCode: 'NE',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '28',
    country: 'US',
    state: 'Nevada',
    stateCode: 'NV',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '29',
    country: 'US',
    state: 'New Hampshire',
    stateCode: 'NH',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '30',
    country: 'US',
    state: 'New Jersey',
    stateCode: 'NJ',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '2 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '31',
    country: 'US',
    state: 'New Mexico',
    stateCode: 'NM',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '32',
    country: 'US',
    state: 'New York',
    stateCode: 'NY',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '5 returns set up',
    status: 'Completed',
    action: ['Set up returns'],
  },
  {
    id: '33',
    country: 'US',
    state: 'North Carolina',
    stateCode: 'NC',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '2 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '34',
    country: 'US',
    state: 'North Dakota',
    stateCode: 'ND',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '35',
    country: 'US',
    state: 'Ohio',
    stateCode: 'OH',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '36',
    country: 'US',
    state: 'Oklahoma',
    stateCode: 'OK',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '37',
    country: 'US',
    state: 'Oregon',
    stateCode: 'OR',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '38',
    country: 'US',
    state: 'Pennsylvania',
    stateCode: 'PA',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '2 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '39',
    country: 'US',
    state: 'Rhode Island',
    stateCode: 'RI',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '40',
    country: 'US',
    state: 'South Carolina',
    stateCode: 'SC',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '41',
    country: 'US',
    state: 'South Dakota',
    stateCode: 'SD',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '42',
    country: 'US',
    state: 'Tennessee',
    stateCode: 'TN',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '43',
    country: 'US',
    state: 'Texas',
    stateCode: 'TX',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '4 returns set up',
    status: 'Completed',
    action: ['Set up returns'],
  },
  {
    id: '44',
    country: 'US',
    state: 'Utah',
    stateCode: 'UT',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '45',
    country: 'US',
    state: 'Vermont',
    stateCode: 'VT',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '46',
    country: 'US',
    state: 'Virginia',
    stateCode: 'VA',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '2 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '47',
    country: 'US',
    state: 'Washington',
    stateCode: 'WA',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '3 returns set up',
    status: 'Completed',
    action: ['Set up returns'],
  },
  {
    id: '48',
    country: 'US',
    state: 'West Virginia',
    stateCode: 'WV',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '49',
    country: 'US',
    state: 'Wisconsin',
    stateCode: 'WI',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '1 returns set up',
    status: 'In progress',
    action: ['Set up returns', 'Mark as completed'],
  },
  {
    id: '50',
    country: 'US',
    state: 'Wyoming',
    stateCode: 'WY',
    countryCode: 'US',
    description: 'You collect tax here',
    returns: '0 returns set up',
    status: 'Not started',
    action: ['Set up returns', 'Mark as completed'],
  },
];

const SetUpReturnsTable = ({ companyId }) => {
  const navigate = useNavigate();

  const handleClick = (state, stateCode, countryCode) => {
    navigate(`${state}?regionCode=${stateCode}&countryCode=${countryCode}`, {
      relative: 'route',
    });
  };

  const { loading, error, data } = useQuery(NEXUSES, {
    variables: {
      companyId: parseInt(companyId),
    },
  });

  if (error) {
    return (
      <Result
        status="500"
        subTitle="We are having a momentary issue. Please try again in sometime."
      />
    );
  }

  const dataSource =
    data?.nexuses?.value?.map((country) => ({
      key: country.id,
      state: country.state,
      description: country.description,
      returns: country.returns,
      status: country.status,
      action: country.action,
    })) || [];

  const pagination = {
    pageSize: 10,
    showSizeChanger: true,
  };

  const columns = [
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Returns',
      dataIndex: 'returns',
      key: 'returns',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: 'Not started', value: 'Not started' },
        { text: 'In progress', value: 'In progress' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => {
        const statusText = record.status;
        let status;
        switch (statusText) {
          case 'Not started':
            status = 'warning';
            break;
          case 'In progress':
            status = 'processing';
            break;
          case 'Completed':
            status = 'success';
            break;
          default:
            status = 'warning';
        }
        return <Badge status={status} text={statusText} />;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        const { state, stateCode, countryCode } = record;
        const actions = Array.isArray(record.action)
          ? record.action
          : [record.action];
        return actions.map((action, index) => (
          <Typography.Link
            key={index}
            onClick={() => handleClick(state, stateCode, countryCode)}
            style={{ marginRight: '8px' }}
          >
            {action}
          </Typography.Link>
        ));
      },
    },
  ];

  return (
    <Table
      dataSource={mockDataSource}
      columns={columns}
      loading={loading}
      pagination={pagination}
      rowKey="id"
    />
  );
};

export default SetUpReturnsTable;
