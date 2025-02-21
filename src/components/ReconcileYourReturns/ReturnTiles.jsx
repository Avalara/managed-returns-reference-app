import { Card, Collapse, Flex, Skeleton, Table, Typography } from 'antd';
import PropTypes from 'prop-types';

import { columns } from './tableColumns';
import { getRegionName } from '../shared/USRegions';

const ReturnTile = ({ regionData }) => {
  const returnsDataSource = regionData?.returns.map((taxReturn) => {
    return {
      key: taxReturn.id,
      taxFormCode: taxReturn.formCode,
      state: getRegionName(regionData.region) || '',
      registrationId: taxReturn.registrationId,
      frequency: taxReturn.filingFrequency,
      totalSales: taxReturn.returnTaxSummary.reportableSalesAmount,
      taxableSales: taxReturn.returnTaxSummary.taxableAmount,
      totalTax: taxReturn.returnTaxSummary.taxAmount,
      adjustments: taxReturn.totalAdjustments,
      amountDue: taxReturn.returnTaxSummary.remittanceAmount,
      status: taxReturn.status,
      link: '',
    };
  });

  const collapseItems = [
    {
      key: '1',
      label: 'Return details',
      children: (
        <Table
          dataSource={returnsDataSource}
          columns={columns}
          pagination={false}
        />
      ),
    },
  ];
  return (
    <Card
      bordered={false}
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <Flex align="flex-start" justify="space-between">
        <Typography.Title level={3}>
          {getRegionName(regionData.region) || ''}
        </Typography.Title>
        <div style={{ alignItems: 'flex-end' }}>
          <p>Amount due</p>
          <Typography.Title level={3}>
            {regionData?.regionTaxSummary?.remittanceAmount}
          </Typography.Title>
        </div>
      </Flex>

      <Collapse items={collapseItems} onChange={() => {}} ghost />
    </Card>
  );
};

const ReturnTiles = ({ loading, dataSource }) => {
  return loading ? (
    <Skeleton active />
  ) : (
    dataSource.map((region, idx) => {
      return <ReturnTile key={idx} regionData={region} />;
    })
  );
};

ReturnTiles.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
};

ReturnTile.propTypes = {
  regionData: PropTypes.object.isRequired,
};

export default ReturnTiles;
