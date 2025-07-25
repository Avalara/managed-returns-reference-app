import { Button, Space, Table, Tag } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import AddReturn from './AddReturn';

const TaxFormsTable = ({ dataSource, loading }) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTaxForm, setSelectedTaxForm] = useState();

  const handleSetupReturn = (record) => {
    setSelectedTaxForm(record);
  };

  const handleCloseDrawer = () => {
    setSelectedTaxForm(null);
  };

  const columns = [
    {
      title: 'Return',
      dataIndex: 'description',
      key: 'description',
      width: 300,
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
      fixed: 'right',
      render: (_, record) => (
        <Button
          color="primary"
          variant="link"
          onClick={() => handleSetupReturn(record)}
        >
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

  return (
    <>
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
        scroll={{ x: 'max-content' }}
        expandable={{
          expandedRowRender: (record) => (
            <Space direction="vertical">
              {record.purpose}
              <table style={{ tableLayout: 'auto' }}>
                <tbody>
                  <tr>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <b>Tax type </b>
                    </td>
                    <td style={{ paddingLeft: '10px' }}>
                      {record.taxTypes ? record.taxTypes.join(', ') : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <b>Tax authority </b>
                    </td>
                    <td style={{ paddingLeft: '10px' }}>
                      {record.taxAuthority || 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Space>
          ),
        }}
      />

      {selectedTaxForm && (
        <AddReturn
          visible={!!selectedTaxForm}
          onClose={handleCloseDrawer}
          taxForm={selectedTaxForm}
        />
      )}
    </>
  );
};

TaxFormsTable.propTypes = {
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      taxAuthority: PropTypes.string,
      taxTypes: PropTypes.arrayOf(PropTypes.string),
      purpose: PropTypes.string,
      taxFormName: PropTypes.string,
      recommended: PropTypes.bool,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

export default TaxFormsTable;
