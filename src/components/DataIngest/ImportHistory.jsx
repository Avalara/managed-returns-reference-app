import { Button, Card, Flex, Segmented, Select, Space, Table } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import queries from '../../graphql/queries';

const TableFilters = ({
  loading,
  // filters,
  setFilters,
  availableStatuses,
}) => {
  const [importTypeSelection, setImportTypeSelection] = useState('All');
  const [statusSelection, setStatusSelection] = useState('All');

  return (
    <Flex align="flex-start" justify="space-between">
      <Space wrap>
        <div>
          Import type:{' '}
          <Select
            // disabled={!companies || companies.length === 1}
            dropdownStyle={{
              width: 400,
            }}
            style={{
              width: 400,
            }}
            title={'Import type'}
            value={importTypeSelection}
            options={[
              { value: 'All', label: <span>All</span> },
              { value: 'Transactions', label: <span>Transactions</span> },
              {
                value: 'Summarized tax liability',
                label: <span>Summarized tax liability</span>,
              },
            ]}
            onChange={(value) => {
              setImportTypeSelection(value);
              setFilters((prev) => {
                return {
                  ...prev,
                  importType: value,
                };
              });
            }}
          />
        </div>
        <div>
          Status:{' '}
          <Select
            disabled={loading || availableStatuses?.length === 0}
            defaultValue={'All'}
            style={{
              width: 228,
            }}
            value={statusSelection}
            options={[
              { value: 'All', label: <span>All</span> },
              ...availableStatuses.map((status) => {
                return { value: status, label: <span>{status}</span> };
              }),
            ]}
            onChange={(value) => {
              setStatusSelection(value);
              setFilters((prev) => {
                return {
                  ...prev,
                  status: value,
                };
              });
            }}
          />
        </div>

        <Button
          disabled={loading}
          type="default"
          onClick={() => {
            setStatusSelection('All');
            setImportTypeSelection('All');
            setFilters({
              search: '',
              importType: 'All',
              status: 'All',
            });
          }}
        >
          Reset
        </Button>
      </Space>
    </Flex>
  );
};

TableFilters.propTypes = {
  loading: PropTypes.bool.isRequired,
  setFilters: PropTypes.func.isRequired,
  availableStatuses: PropTypes.array.isRequired,
};

const columns = [
  {
    title: 'Batch name',
    dataIndex: 'batchName',
    key: 'batchName',
    fixed: true,
    render: (text, record) => {
      return record.name;
    },
  },
  {
    title: 'Import type',
    dataIndex: 'importType',
    key: 'importType',
    responsive: ['lg'],
  },
  {
    title: 'Errors',
    dataIndex: 'errors',
    key: 'errors',
    responsive: ['lg'],
  },
  {
    title: 'Results',
    dataIndex: 'results',
    key: 'results',
    responsive: ['lg'],
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    responsive: ['lg'],
  },
];

const HistoryTable = ({
  companyId,
  setLoading,
  filters,
  setAvailableStatuses,
}) => {
  console.log('filters', filters);
  const data = [
    {
      key: '1',
      batchName: 'Batch 1',
      importType: 'Transactions',
      errors: 0,
      results: 10,
      date: '2023-05-01',
      status: 'Completed',
    },
    {
      key: '2',
      batchName: 'Batch 2',
      importType: 'Summarized tax liability',
      errors: 2,
      results: 8,
      date: '2023-04-15',
      status: 'Completed with errors',
    },
  ];
  // const { loading, error, data } = useQuery(queries.filings, {
  //   variables: {
  //     companyId: parseInt(companyId),
  //   },
  // });
  const loading = false;

  const dataSource = applyFilters(data, filters);
  // setAvailableStatuses(['transactions, taxLiability']);

  return <Table loading={loading} dataSource={dataSource} columns={columns} />;
};

function applyFilters(data, filters) {
  return data.filter((item) => {
    const importTypeMatch =
      filters.importType === 'All' || item.importType === filters.importType;
    const statusMatch =
      filters.status === 'All' || item.status === filters.status;
    // const searchMatch = item.name
    //   .toLowerCase()
    //   .includes(filters.search.toLowerCase());

    return importTypeMatch && statusMatch;
  });
}

const ImportHistory = () => {
  const [filters, setFilters] = useState({
    importType: 'All',
    status: 'All',
  });
  const { companyId } = useOutletContext();
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <>
        <Card
          bordered={false}
          style={{
            boxShadow: 'none',
            marginTop: 20,
            width: '100%',
          }}
        >
          <TableFilters
            setFilters={setFilters}
            availableStatuses={availableStatuses}
            loading={loading}
          />
        </Card>

        <Card>
          <HistoryTable
            setAvailableStatuses={setAvailableStatuses}
            companyId={companyId}
            filters={filters}
          />
        </Card>
        <br />
      </>
    </>
  );
};

export default ImportHistory;
