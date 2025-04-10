import PropTypes from 'prop-types';
import { Card, Result, Table } from 'antd';
import { useEffect } from 'react';

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
      <Result
        status="500"
        subTitle="We are having a momentary issue, please try again in some time."
      />
    );

  return viewMode === 'table' ? (
    <Card>
      <Table
        loading={loading}
        dataSource={tableData}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />
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
