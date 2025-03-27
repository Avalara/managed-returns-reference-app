import { Card, Collapse, Skeleton, Statistic, Table } from 'antd';
import PropTypes from 'prop-types';

import { columns } from './tableColumns';
import { getRegionName } from '../shared/USRegions';

const ReturnTile = ({ regionData }) => {
  const returnsDataSource = regionData?.returns.map((taxReturn) => ({
    key: taxReturn.id,
    taxFormCode: taxReturn.formCode,
    state: getRegionName(regionData.region) || '',
    registrationId: taxReturn.registrationId,
    frequency: taxReturn.filingFrequency,
    grossSales: taxReturn.returnTaxSummary.reportableSalesAmount,
    netSales: taxReturn.returnTaxSummary.taxableAmount,
    exemptSales: taxReturn.returnTaxSummary.nonTaxableAmount,
    totalTax: taxReturn.returnTaxSummary.taxAmount,
    adjustments: taxReturn.totalAdjustments,
    amountDue: taxReturn.returnTaxSummary.remittanceAmount,
    status: taxReturn.status,
    link: '',
  }));

  const collapseItems = [
    {
      key: '1',
      label: 'Return details',
      children: (
        <Table
          dataSource={returnsDataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      ),
    },
  ];
  return (
    <Card
      style={{ marginBottom: 20 }}
      title={<h3>{getRegionName(regionData.region) || ''}</h3>}
      extra={
        <div style={{ margin: '15px', textAlign: 'right' }}>
          <Statistic
            title="Amount due"
            value={regionData?.regionTaxSummary?.remittanceAmount.toLocaleString(
              'en-US',
              {
                style: 'currency',
                currency: 'USD',
              }
            )}
            suffix="USD"
          />
        </div>
      }
    >
      <Collapse items={collapseItems} onChange={() => {}} ghost />
    </Card>
  );
};

const ReturnTiles = ({ loading, dataSource }) =>
  loading ? (
    <Card>
      <Skeleton active />
    </Card>
  ) : (
    dataSource.map((region, idx) => (
      <ReturnTile key={idx} regionData={region} />
    ))
  );

ReturnTiles.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
};

ReturnTile.propTypes = {
  regionData: PropTypes.object.isRequired,
};

export default ReturnTiles;
