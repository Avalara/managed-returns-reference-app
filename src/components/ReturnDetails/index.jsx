import { PropTypes } from 'prop-types';
import { Button, Card, Descriptions, Table } from 'antd';
import { useOutletContext, useParams } from 'react-router-dom';

import { useFilingsData } from '../ReconcileYourReturns/hooks';

const ReturnSummary = ({ returnData }) => {
  const items = [
    {
      key: '1',
      label: 'Form number',
      children: <p>{returnData?.[0]?.taxFormCode || null}</p>,
    },
    {
      key: '2',
      label: 'Form name',
      children: <p>{returnData?.[0]?.formName || null}</p>,
    },
    {
      key: '3',
      label: 'Frequency',
      children: <p>{returnData?.[0]?.frequency || null}</p>,
    },
    {
      key: '4',
      label: 'Period',
      children: <p>{returnData?.[0]?.month || null}</p>,
    },
    {
      key: '5',
      label: 'Registration ID',
      children: <p>{returnData?.[0]?.registrationId || null}</p>,
    },
    {
      key: '6',
      label: 'Tax type',
      children: <p>{returnData?.[0]?.taxType || null}</p>,
    },
    {
      key: '7',
      label: 'Tax authority',
      children: <p>{returnData?.[0]?.taxAuthority || null}</p>,
    },
  ];

  return (
    <Descriptions
      title=""
      items={items}
      colon={false}
      column={1}
      layout={'horizontal'}
      labelStyle={{
        color: 'black',
        fontWeight: 'bold',
      }}
    />
  );
};

const ReturnDetails = () => {
  const { companyId } = useOutletContext();
  const { country, year, month, region } = useParams();

  const { loading, error, tableData, tileData } = useFilingsData({
    companyId: parseInt(companyId),
    year: parseInt(year),
    month: parseInt(month),
    country,
    region,
    // setAmountDue,
    // setReturnCount,
    // filters,
    // setAvailableStates,
    // setAvailableStatuses,
  });

  const dataSource = extractTableData(tableData);

  return (
    <div id="return-details">
      <h1>Return details and adjustments</h1>

      <ReturnSummary returnData={tableData} />
      <Card bordered={false}>
        <Button type="text">+ Add an adjustment</Button>
        <Table loading={loading} dataSource={dataSource} columns={columns} />
      </Card>
    </div>
  );
};

export default ReturnDetails;

const columns = [
  { title: '', dataIndex: 'rowLabel', key: 'rowLabel' },
  { title: 'Total sales', dataIndex: 'totalSales', key: 'totalSales' },
  {
    title: 'Taxable sales',
    dataIndex: 'taxableSales',
    key: 'taxableSales',
  },
  {
    title: 'Payment to jurisdiction',
    dataIndex: 'paymentToJurisdiction',
    key: 'paymentToJurisdiction',
  },
  {
    title: 'Payment to Avalara',
    dataIndex: 'paymentToAvalara',
    key: 'paymentToAvalara',
  },
];
const fieldsToExtract = [
  'sut',
  'discount',
  'priorDiscount',
  'priorPayment',
  'credits',
  'excludedCredits',
];

function extractTableData(returnData) {
  const tableData = [];
  if (!returnData) return tableData;

  const adjustmentData = returnData?.[0]?.adjustments;
  // console.log('Adjustment data', adjustmentData);
  fieldsToExtract.forEach((field, i) => {
    if (adjustmentData[field]) {
      tableData.push({
        key: i,
        rowLabel: field,
        totalSales: returnData[field].totalSales,
        taxableSales: returnData[field].taxableSales,
        paymentToJurisdiction: returnData[field].paymentToJurisdiction,
        paymentToAvalara: returnData[field].paymentToAvalara,
      });
    }
  });
  return tableData;
}
