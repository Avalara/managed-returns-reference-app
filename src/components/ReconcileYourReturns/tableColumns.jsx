import { Button, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import ReturnsStatus from './ReturnsStatus';

export const columns = [
  {
    title: 'Return',
    dataIndex: 'taxFormCode',
    key: 'taxFormCode',
    fixed: true,
    render: (text, record) => {
      return record.taxFormCode;
      // return (
      //   <Link
      //     to={`${record.country}/${record.regionCode}/${record.year}/${record.month}`}
      //   >
      //     {record.taxFormCode}
      //   </Link>
      // );
    },
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    sorter: (a, b) => (a && a.state ? a.state.localeCompare(b.state) : -1),
    responsive: ['lg'],
  },
  {
    title: 'Registration #',
    dataIndex: 'registrationId',
    key: 'registrationId',
    responsive: ['lg'],
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
    responsive: ['lg'],
  },
  {
    title: 'Total sales',
    dataIndex: 'totalSales',
    key: 'totalSales',
  },
  {
    title: 'Taxable sales',
    dataIndex: 'taxableSales',
    key: 'taxableSales',
    responsive: ['lg'],
  },
  {
    title: 'Total tax',
    dataIndex: 'totalTax',
    key: 'totalTax',
    responsive: ['lg'],
  },
  {
    title: 'Adjustments',
    dataIndex: 'adjustments',
    key: 'adjustments',
    responsive: ['lg'],
  },
  {
    title: 'Amount due',
    dataIndex: 'amountDue',
    key: 'amountDue',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => (a && a.status ? a.status.localeCompare(b.status) : 1),
    render: (text, record) => {
      return <ReturnsStatus filingStatus={record.status} />;
    },
  },
  {
    title: '',
    dataIndex: 'link',
    key: 'link',
    render: (text, record) => (
      <Dropdown
        placement="bottom"
        trigger="click"
        menu={{
          items: [
            {
              key: '1',
              label: <span>Go to return settings</span>,
            },
            {
              key: '2',
              label: <span>Download filing confirmation</span>,
              disabled: record?.status !== 'Filed',
            },
          ],
        }}
      >
        <Button
          type="text"
          icon={<EllipsisOutlined />}
          onClick={(e) => {
            // console.log('record', record);
            // console.log('e', e);
          }}
        />
      </Dropdown>
    ),
  },
];
