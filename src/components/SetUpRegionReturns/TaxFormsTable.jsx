import { Button, Space, Table, Tag } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';

const TaxFormsTable = ({ dataSource, loading }) => {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    {
      title: 'Return',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Form number',
      dataIndex: 'taxFormName',
      key: 'taxFormName',
    },
    {
      title: '',
      dataIndex: 'recommended',
      key: 'recommended',
      render: (recommended) =>
        recommended ? <Tag color="green">Recommended</Tag> : null,
    },
    {
      title: '',
      key: 'action',
      render: () => (
        <Button color="primary" variant="link">
          Set up returns
        </Button>
      ),
    },
  ];

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: dataSource.length,
    showSizeChanger: false,
  };

  const currentPageData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      style={{ width: '100%' }}
      loading={loading}
      pagination={pagination}
      onChange={(page) => {
        setCurrentPage(page.current);
      }}
      rowKey="taxFormCode"
      expandable={{
        expandedRowRender: (record) => (
          <Space direction="vertical">
            {record.purpose}
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Tax type </b>
                  </td>
                  <td style={{ paddingLeft: '10px' }}>
                    {record.taxTypes.join(', ')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Tax authority </b>
                  </td>
                  <td style={{ paddingLeft: '10px' }}>
                    {record.taxAuthorityName}
                  </td>
                </tr>
              </tbody>
            </table>
          </Space>
        ),
      }}
    />
  );
};

TaxFormsTable.propTypes = {
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      taxAuthorityName: PropTypes.string,
      taxTypes: PropTypes.arrayOf(PropTypes.string),
      purpose: PropTypes.string,
      taxFormName: PropTypes.string,
      recommended: PropTypes.bool,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

export default TaxFormsTable;
