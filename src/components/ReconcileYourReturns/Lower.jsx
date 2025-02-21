import { useState } from 'react';
import {
  Button,
  Card,
  Flex,
  Segmented,
  Select,
  Space,
} from 'antd';
import { BarsOutlined, TableOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import ReturnsDataView from './ReturnsDataView';

const TableFilters = ({
  loading,
  setViewMode,
  // filters,
  setFilters,
  availableStates,
  availableStatuses,
}) => {
  const [stateSelection, setStateSelection] = useState('All');
  const [statusSelection, setStatusSelection] = useState('All');

  return (
    <Flex align="flex-start" justify="space-between">
      <Space wrap>
        <div>
          State:{' '}
          <Select
            disabled={loading || availableStates?.length === 0}
            defaultValue={'All'}
            dropdownStyle={{
              width: 200,
            }}
            style={{
              width: 228,
            }}
            value={stateSelection}
            options={[
              { value: 'All', label: <span>All</span> },
              ...availableStates.map((state) => {
                return { value: state, label: <span>{state}</span> };
              }),
            ]}
            onChange={(value) => {
              setStateSelection(value);
              setFilters((prev) => {
                return {
                  ...prev,
                  state: value,
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
            setStateSelection('All');
            setFilters({
              state: 'All',
              status: 'All',
            });
          }}
        >
          Clear filters
        </Button>
      </Space>
      <Segmented
        options={[
          {
            label: (
              <div>
                <TableOutlined /> Table
              </div>
            ),
            value: 'table',
          },
          {
            label: (
              <div>
                <BarsOutlined /> Tile
              </div>
            ),
            value: 'tile',
          },
        ]}
        onChange={(value) => {
          setViewMode(value);
        }}
      />
    </Flex>
  );
};

TableFilters.propTypes = {
  loading: PropTypes.bool.isRequired,
  setViewMode: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  availableStates: PropTypes.array.isRequired,
  availableStatuses: PropTypes.array.isRequired,
};

const Lower = ({
  companyId,
  country,
  month,
  year,
  setReturnCount,
  setAmountDue,
}) => {
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({ state: 'All', status: 'All' });
  const [availableStates, setAvailableStates] = useState([]);
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
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
          setViewMode={setViewMode}
          setFilters={setFilters}
          availableStates={availableStates}
          availableStatuses={availableStatuses}
          loading={loading}
        />
      </Card>

      <br />

      <ReturnsDataView
        setLoading={setLoading}
        viewMode={viewMode}
        year={year}
        month={month}
        companyId={companyId}
        country={country}
        setAmountDue={setAmountDue}
        setReturnCount={setReturnCount}
        filters={filters}
        setAvailableStates={setAvailableStates}
        setAvailableStatuses={setAvailableStatuses}
      />
    </>
  );
};

Lower.propTypes = {
  companyId: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  setReturnCount: PropTypes.func.isRequired,
  setAmountDue: PropTypes.func.isRequired,
};

export default Lower;
