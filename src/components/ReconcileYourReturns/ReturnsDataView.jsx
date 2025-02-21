import PropTypes from 'prop-types';
import { Card, Table, Tooltip } from 'antd';
import { useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';

import ReturnTiles from './ReturnTiles';
import { columns } from './tableColumns';

import { useFilingsData } from './hooks';

function ReturnsDataView({
  setLoading,
  viewMode,
  companyId,
  year,
  month,
  country,
  setAmountDue,
  setReturnCount,
  filters,
  setAvailableStates,
  setAvailableStatuses,
}) {
  const { loading, error, tableData, tileData } = useFilingsData({
    companyId,
    year,
    month,
    country,
    setAmountDue,
    setReturnCount,
    filters,
    setAvailableStates,
    setAvailableStatuses,
  });

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  if (error)
    return (
      <>
        <span>An error occurred retrieving the data</span>{' '}
        <Tooltip title={JSON.stringify(error)}>
          <InfoCircleOutlined />
        </Tooltip>
      </>
    );

  return viewMode === 'table' ? (
    <Card bordered={false} style={{ boxShadow: 'none' }}>
      <Table loading={loading} dataSource={tableData} columns={columns} />
    </Card>
  ) : (
    <ReturnTiles loading={loading} dataSource={tileData} />
  );
}

ReturnsDataView.propTypes = {
  setLoading: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired,
  setAmountDue: PropTypes.func.isRequired,
  setReturnCount: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setAvailableStates: PropTypes.func.isRequired,
  setAvailableStatuses: PropTypes.func.isRequired,
};

export default ReturnsDataView;
