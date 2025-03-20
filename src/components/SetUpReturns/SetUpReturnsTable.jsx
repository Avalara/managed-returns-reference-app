import { Table, Typography, Alert, Badge, Result } from 'antd';
import { useQuery } from '@apollo/client';
import { nexuses } from '../../graphql/queries/Nexuses.js';
import { Link, useNavigate } from 'react-router-dom';

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
];

const SetUpReturnsTable = ({ companyId }) => {
  const navigate = useNavigate();

  const handleClick = (state, stateCode, countryCode) => {
    navigate(`${state}?stateCode=${stateCode}&countryCode=${countryCode}`, {
      relative: 'route',
    });
  };

  const { loading, error, data } = useQuery(nexuses, {
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
    defaultPageSize: 5,
    showSizeChanger: false,
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
    />
  );
};

export default SetUpReturnsTable;
