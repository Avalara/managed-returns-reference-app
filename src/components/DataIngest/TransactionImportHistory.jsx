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
  Popover,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DownloadOutlined } from '@ant-design/icons';
import {
  transactionImportHistory as TRANSACTION_IMPORT_HISTORY,
  transactionBatchErrors as TRANSACTION_BATCH_ERRORS,
} from '../../graphql/queries';

// Extend dayjs with plugins
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

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

const BatchErrorsDownload = ({ record, companyId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [batchErrorsData, setBatchErrorsData] = useState(null);

  const [getBatchErrors, { loading: batchErrorsLoading }] = useLazyQuery(
    TRANSACTION_BATCH_ERRORS,
    {
      onCompleted: (data) => {
        setBatchErrorsData(data);
      },
      onError: (error) => {
        messageApi.error(`Error fetching batch errors: ${error.message}`);
      },
      fetchPolicy: 'network-only',
    }
  );

  const handleDownloadClick = async () => {
    if (!batchErrorsData) {
      // Fetch data first if not already loaded
      await getBatchErrors({
        variables: {
          companyId: parseInt(companyId),
          batchId: record.transactionBatchId,
        },
      });
    }

    if (batchErrorsData?.transactions?.value) {
      // Create JSON content
      const jsonContent = JSON.stringify(
        batchErrorsData.transactions.value,
        null,
        2
      );

      // Create and download file
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `batch_errors_${record.transactionBatchId}_${dayjs().format('YYYY-MM-DD')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      messageApi.success('Batch errors downloaded successfully');
    }
  };

  const handlePopoverVisibleChange = async (visible) => {
    if (visible && !batchErrorsData) {
      // Fetch data when popover opens
      await getBatchErrors({
        variables: {
          companyId: parseInt(companyId),
          batchId: record.transactionBatchId,
        },
      });
    }
    setPopoverVisible(visible);
  };

  const popoverContent = (
    <div style={{ maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
      {batchErrorsLoading ? (
        <div>Loading batch errors...</div>
      ) : batchErrorsData ? (
        <pre style={{ fontSize: '12px', margin: 0 }}>
          {JSON.stringify(batchErrorsData.transactions.value, null, 2)}
        </pre>
      ) : (
        <div>No batch errors data available</div>
      )}
    </div>
  );

  // Only show download button if it has error file
  if (!record.hasErrorFile) {
    return null;
  }

  return (
    <>
      {contextHolder}
      <Popover
        content={popoverContent}
        title="Batch Errors JSON"
        trigger="hover"
        open={popoverVisible}
        onOpenChange={handlePopoverVisibleChange}
        placement="left"
      >
        <Button
          color="primary"
          variant="link"
          icon={<DownloadOutlined />}
          onClick={handleDownloadClick}
          loading={batchErrorsLoading}
          size="small"
        />
      </Popover>
    </>
  );
};

BatchErrorsDownload.propTypes = {
  record: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired,
};

const columns = [
  {
    title: 'File name',
    dataIndex: 'fileName',
    key: 'fileName',
    fixed: 'left',
  },
  {
    title: 'Import type',
    dataIndex: 'importType',
    key: 'importType',
    responsive: ['lg'],
  },
  {
    title: 'Transaction Batch ID',
    dataIndex: 'transactionBatchId',
    key: 'transactionBatchId',
    responsive: ['lg'],
  },
  {
    title: 'Error Messages',
    dataIndex: 'errorMessages',
    key: 'errorMessages',
    responsive: ['xl'],
    render: (_, record) => {
      if (!record.hasErrorFile) return null;

      return (
        <BatchErrorsDownload record={record} companyId={record.companyId} />
      );
    },
  },
  {
    title: 'Has Error File',
    dataIndex: 'hasErrorFile',
    key: 'hasErrorFile',
    responsive: ['xl'],
    render: (hasErrorFile) => (hasErrorFile ? 'Yes' : 'No'),
  },
  {
    title: 'Date uploaded',
    dataIndex: 'createdDate',
    key: 'createdDate',
    render: (createdDate) => {
      if (!createdDate) return '';
      // Convert UTC createdDate to local timezone
      return dayjs.utc(createdDate).local().format('MMM D, YYYY h:mm A');
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    fixed: 'right',
    render: (status) => getStatusBadge(status),
  },
];

const HistoryTable = ({ loading, dataSource, companyId }) => (
  <Table
    loading={loading}
    dataSource={dataSource.map((item) => ({ ...item, companyId }))}
    columns={columns}
    scroll={{ x: 'max-content' }}
    pagination={
      dataSource && dataSource.length > 50
        ? {
            total: dataSource.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: () => `Total ${dataSource.length} items`,
          }
        : true
    }
  />
);

HistoryTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
  companyId: PropTypes.string.isRequired,
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
  const transformedData = data?.transactions?.value?.importHistory?.value || [];

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
        <HistoryTable
          loading={loading}
          dataSource={filteredData}
          companyId={companyId}
        />
      </Card>
    </Space>
  );
};

export default TransactionImportHistory;
