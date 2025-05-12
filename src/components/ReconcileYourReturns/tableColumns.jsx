/*
 * Contents of this file was produced with a help of a code generation tool and
 * subsequently reviewed and edited by a human.
 *
 * While some of the code was created by an AI assisted service, manual adjustments
 * have been made to ensure correctness, readability, functionality and compliance
 * to Avalara's coding standards and guidelines.
 * Any future modifications should be approached with caution to avoid
 * overwriting the manual changes.
 *
 *
 * This source code is owned by Avalara Inc. Unauthorized copying of this file,
 * via any medium, is strictly prohibited. Proprietary and confidential.
 *
 * For more information, refer to the documentation or contact the development team.
 */

import { Button, Dropdown, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { filingConfirmationAttachment as FILING_CONFIRMATION_ATTACHMENT } from '../../graphql/queries';
import ReturnsStatus, { getPrettyStatus } from './ReturnsStatus';
import { apolloClient } from '../../graphql';

const baseColumns = [
  {
    title: 'Return',
    dataIndex: 'taxFormCode',
    key: 'taxFormCode',
    fixed: true,
    render: (text, record) => record.taxFormCode,
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
    title: 'Gross sales',
    dataIndex: 'grossSales',
    key: 'grossSales',
    render: (value) =>
      Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value),
  },
  {
    title: 'Net sales',
    dataIndex: 'netSales',
    key: 'netSales',
    render: (value) =>
      Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value),
    responsive: ['lg'],
  },
  {
    title: 'Exempt sales',
    dataIndex: 'exemptSales',
    render: (value) =>
      Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value),
    key: 'exemptSales',
  },
  {
    title: 'Total tax',
    dataIndex: 'totalTax',
    key: 'totalTax',
    render: (value) =>
      Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value),
    responsive: ['lg'],
  },
  {
    title: 'Adjustments',
    dataIndex: 'adjustments',
    key: 'adjustments',
    render: (value) =>
      Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value),
    responsive: ['lg'],
  },
  {
    title: 'Amount due',
    dataIndex: 'amountDue',
    render: (value) =>
      Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value),
    key: 'amountDue',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => (a && a.status ? a.status.localeCompare(b.status) : 1),
    render: (text, record) => <ReturnsStatus filingStatus={record.status} />,
  },
];

const FilingConfirmationCell = ({ record, companyId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const handleDownloadFilingConfirmation = async () => {
    try {
      setLoading(true);

      const { data } = await apolloClient.query({
        query: FILING_CONFIRMATION_ATTACHMENT,
        variables: {
          companyId: parseInt(companyId),
          filingReturnId: parseFloat(record.id),
        },
        fetchPolicy: 'network-only', // Don't use cache for this query
      });

      if (data && data.filingConfirmationAttachment) {
        const byteArray = new Uint8Array(data.filingConfirmationAttachment);
        const blob = new Blob([byteArray], {
          type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FilingConfirmation_${record.taxFormCode}_${record.state || ''}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        messageApi.success('Filing confirmation downloaded successfully');
      } else {
        messageApi.warning('No filing confirmation available for this return');
      }
    } catch (error) {
      messageApi.error(
        `Error downloading filing confirmation: ${error.message}`
      );
      console.error('Error in filing confirmation download:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{
          items: [
            {
              key: '1',
              label: <span>Go to return settings</span>,
            },
            {
              key: '2',
              label: <span>Download filing confirmation</span>,
              disabled: getPrettyStatus(record?.status)?.[0] !== 'Filed',
              onClick: handleDownloadFilingConfirmation,
            },
          ],
        }}
      >
        <Button type="text" icon={<EllipsisOutlined />} loading={loading} />
      </Dropdown>
    </>
  );
};

FilingConfirmationCell.propTypes = {
  record: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired,
};

export const columns = (companyId) => [
  ...baseColumns,
  {
    title: '',
    dataIndex: 'link',
    key: 'link',
    fixed: 'right',
    render: (text, record) => (
      <FilingConfirmationCell record={record} companyId={companyId} />
    ),
  },
];
