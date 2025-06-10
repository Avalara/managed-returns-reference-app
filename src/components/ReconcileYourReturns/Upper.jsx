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

import { useLazyQuery } from '@apollo/client';
import {
  Button,
  DatePicker,
  Flex,
  Space,
  Statistic,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';

import {
  liabilityReports as LIABILITY_REPORTS,
  filingConfirmationAttachments as FILING_CONFIRMATION_ATTACHMENTS,
} from '../../graphql/queries';

const { Title } = Typography;

const FilingPeriodSelector = ({ date, setDate }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Title level={2}>Filing period</Title>
      <Space>
        <DatePicker
          onChange={(newDate) => {
            setDate(newDate);
            const newUrl = new URL(
              '.',
              window.origin +
                `/returns/reconcile/${newDate.year()}/${newDate.month()}`
            );

            navigate(newUrl, {
              relative: 'path',
            });
          }}
          allowClear={false}
          picker="month"
          style={{ minWidth: 180 }}
          value={date}
          format="MMMM YYYY"
        />
        <Button
          type="text"
          onClick={() => setDate(dayjs())}
          disabled={dayjs().isSame(date, 'month')}
        >
          Back to current filing period
        </Button>
      </Space>
    </div>
  );
};

FilingPeriodSelector.propTypes = {
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
};

const Upper = ({ companyId, date, setDate, amountDue }) => {
  const [downloadLink, setDownloadLink] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  const [downloadLiabilityReport, { loading: liabilityReportsLoading }] =
    useLazyQuery(LIABILITY_REPORTS, {
      onError: (error) => {
        messageApi.error(
          `Failed to download liability reports: ${error.message}`
        );
        console.error('Liability reports download error:', error);
      },
    });

  const [downloadFilingConfirmation, { loading: filingConfirmationsLoading }] =
    useLazyQuery(FILING_CONFIRMATION_ATTACHMENTS, {
      onError: (error) => {
        messageApi.error(
          `Failed to download filing confirmations: ${error.message}`
        );
        console.error('Filing confirmations download error:', error);
      },
    });

  const downloadLiabilityReports = async () => {
    try {
      const { data } = await downloadLiabilityReport({
        variables: {
          companyId: parseInt(companyId),
          year: date.year(),
          month: date.month(),
        },
      });

      if (
        data &&
        data.liabilityReports &&
        data.liabilityReports.value &&
        data.liabilityReports.value.reports
      ) {
        const byteArray = new Uint8Array(data.liabilityReports.value.reports);
        const blob = new Blob([byteArray], {
          type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LiabilityReports_${date.format('YYYY-MM-DD')}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        messageApi.success('Liability reports downloaded successfully');
      } else {
        messageApi.warning(
          'No liability reports available for the selected period'
        );
      }
    } catch (error) {
      messageApi.error(`Error downloading liability reports: ${error.message}`);
      console.error('Error in liability reports download:', error);
    }
  };

  const downloadFilingConfirmations = async () => {
    try {
      const { data } = await downloadFilingConfirmation({
        variables: {
          companyId: parseInt(companyId),
          year: date.year(),
          month: date.month(),
        },
      });

      if (data && data.filingConfirmationAttachments) {
        const byteArray = new Uint8Array(data.filingConfirmationAttachments);
        const blob = new Blob([byteArray], {
          type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FilingConfirmations_${date.format('YYYY-MM-DD')}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        messageApi.success('Filing confirmations downloaded successfully');
      } else {
        messageApi.warning(
          'No filing confirmations available for the selected period'
        );
      }
    } catch (error) {
      messageApi.error(
        `Error downloading filing confirmations: ${error.message}`
      );
      console.error('Error in filing confirmations download:', error);
    }
  };

  return (
    <Flex align="center" justify="space-between">
      {contextHolder}
      <Space direction="vertical">
        <FilingPeriodSelector date={date} setDate={setDate} />
        <Space>
          <Button
            type="default"
            onClick={downloadLiabilityReports}
            disabled={liabilityReportsLoading}
          >
            <DownloadOutlined />
            Download liability reports
          </Button>
          {downloadLink && (
            <>
              <br />
              <a href={downloadLink}>Download</a>
            </>
          )}
          <Button
            type="default"
            onClick={downloadFilingConfirmations}
            disabled={filingConfirmationsLoading}
            loading={filingConfirmationsLoading}
          >
            {!filingConfirmationsLoading && <FilePdfOutlined />}
            Download filing confirmations
          </Button>
        </Space>
      </Space>
      {amountDue !== null && amountDue !== undefined && (
        <div style={{ textAlign: 'right' }}>
          <Statistic
            title="Amount due"
            value={amountDue.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
            suffix="USD"
          />
        </div>
      )}
    </Flex>
  );
};

Upper.propTypes = {
  companyId: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
  amountDue: PropTypes.number,
};

export default Upper;
