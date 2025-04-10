import {
  Button,
  Card,
  Form,
  Result,
  Select,
  Space,
  Table,
  Badge,
  Input,
} from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { transactionImportHistory as TRANSACTION_IMPORT_HISTORY } from '../../graphql/queries';
const { Search } = Input;

const TableFilters = ({ loading, setFilters, availableStatuses }) => {
  const [form] = Form.useForm();

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setFilters({
      search: values.search || '',
      importType: values.importType || 'All',
      status: values.status || 'All',
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      search: '',
      importType: 'All',
      status: 'All',
    });
  };

  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{ search: '', importType: 'All', status: 'All' }}
      onValuesChange={handleFormChange}
    >
      <Form.Item name="search" label="Search">
        <Search
          placeholder="Search by file name"
          style={{ width: 250 }}
          disabled={loading}
        />
      </Form.Item>

      <Form.Item name="importType" label="Import type">
        <Select
          disabled={loading}
          style={{ width: 250 }}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Transactions', label: 'Transactions' },
            {
              value: 'Summarized tax liability',
              label: 'Summarized tax liability',
            },
          ]}
        />
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select
          disabled={loading || availableStatuses?.length === 0}
          style={{ width: 200 }}
          options={[
            { value: 'All', label: 'All' },
            ...availableStatuses.map((status) => ({
              value: status,
              label: status,
            })),
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Button disabled={loading} onClick={handleReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

TableFilters.propTypes = {
  loading: PropTypes.bool.isRequired,
  setFilters: PropTypes.func.isRequired,
  availableStatuses: PropTypes.array.isRequired,
};

const getStatusBadge = (status) => {
  const statusUpper = status?.toUpperCase();

  // Convert to camel case for display (capitalize first letter of each word)
  const displayStatus = status
    ?.toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  switch (statusUpper) {
    case 'SUBMITTED':
      return <Badge status="processing" text={displayStatus} />;
    case 'PROCESSING':
      return <Badge status="processing" text={displayStatus} />;
    case 'COMPLETED':
      return <Badge status="success" text={displayStatus} />;
    case 'FAILED':
      return <Badge status="error" text={displayStatus} />;
    case 'DELETED':
      return <Badge status="error" text={displayStatus} />;
    case 'DUPLICATE':
      return <Badge status="warning" text={displayStatus} />;
    case 'BLOCKED':
      return <Badge status="error" text={displayStatus} />;
    default:
      return <Badge status="default" text={displayStatus} />;
  }
};

const columns = [
  {
    title: 'File name',
    dataIndex: 'fileName',
    key: 'fileName',
    fixed: true,
  },
  {
    title: 'Import type',
    dataIndex: 'importType',
    key: 'importType',
    responsive: ['lg'],
  },
  {
    title: 'Source file',
    dataIndex: 'importFileId',
    key: 'importFileId',
    responsive: ['lg'],
  },
  {
    title: 'Errors',
    dataIndex: 'errorFileId',
    key: 'errorFileId',
    responsive: ['lg'],
  },
  {
    title: 'Results',
    dataIndex: 'results',
    key: 'results',
    responsive: ['lg'],
  },
  {
    title: 'Date uploaded',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    responsive: ['lg'],
    render: (status) => getStatusBadge(status),
  },
];

const HistoryTable = ({ loading, dataSource }) => (
  <Table loading={loading} dataSource={dataSource} columns={columns} />
);

HistoryTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
};

function applyFilters(data, filters) {
  return data.filter((item) => {
    const searchMatch =
      !filters.search ||
      (item.fileName &&
        item.fileName.toLowerCase().includes(filters.search.toLowerCase()));
    const importTypeMatch =
      filters.importType === 'All' || item.importType === filters.importType;
    const statusMatch =
      filters.status === 'All' || item.status === filters.status;
    return searchMatch && importTypeMatch && statusMatch;
  });
}

const TransactionImportHistory = () => {
  const [filters, setFilters] = useState({
    search: '',
    importType: 'All',
    status: 'All',
  });
  const { companyId } = useOutletContext();
  const [availableStatuses, setAvailableStatuses] = useState([]);

  // Query transaction import history
  const { loading, error, data } = useQuery(TRANSACTION_IMPORT_HISTORY, {
    variables: {
      companyId: parseInt(companyId),
    },
    fetchPolicy: 'network-only',
  });

  // Get available statuses
  useEffect(() => {
    if (data?.transactions?.value?.importHistory?.value) {
      // Extract unique statuses for the filter dropdown
      const statuses = [
        ...new Set(
          data.transactions.value.importHistory.value.map((item) => item.status)
        ),
      ];
      setAvailableStatuses(statuses);
    }
  }, [data]);

  if (error) {
    return (
      <Result
        status="500"
        subTitle="We are having a momentary issue, please try again in some time."
      />
    );
  }

  // Transform the data for the table
  const transformedData =
    data?.transactions?.value?.importHistory?.value?.map((item, index) => ({
      key: item.transactionBatchId || index.toString(),
      fileName: item.fileName,
      importType: item.importType,
      errorMessages: item.errorMessages,
      hasErrorFile: item.hasErrorFile,
      status: item.status,
      importFileId: item.importFileId,
      errorFileId: item.errorFileId,
    })) || [];

  // Apply filters to the data
  const filteredData = applyFilters(transformedData, filters);

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Card>
        <TableFilters
          setFilters={setFilters}
          availableStatuses={availableStatuses}
          loading={loading}
        />
      </Card>

      <Card>
        <HistoryTable loading={loading} dataSource={filteredData} />
      </Card>
    </Space>
  );
};

export default TransactionImportHistory;
