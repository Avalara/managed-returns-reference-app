import { useLazyQuery } from '@apollo/client';
import { Button, DatePicker, Flex, Space, Statistic, Typography } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';

import { liabilityReports as LIABILITY_REPORTS } from '../../graphql/queries';

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

            // console.log('newUrl', newUrl);
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
  // const [downloadBlob, setDownloadBlob] = useState();
  const [downloadLink, setDownloadLink] = useState();
  // https://www.apollographql.com/docs/react/data/queries#manual-execution-with-uselazyquery
  const [
    downloadLiabilityReport,
    {
      // called,
      // error,
      loading,
      // data,
    },
  ] = useLazyQuery(LIABILITY_REPORTS);

  const downloadLiabilityReports = async () => {
    const { data } = await downloadLiabilityReport({
      variables: {
        companyId: parseInt(companyId),
        year: date.year(),
        month: date.month(),
      },
    });

    if (data && data.liabilityReports) {
      const byteArray = new Uint8Array(data.liabilityReports?.reports);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LiabilityReports_${date.format('YY-MM-D')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Flex align="center" justify="space-between">
      <Space direction="vertical">
        <FilingPeriodSelector date={date} setDate={setDate} />
        <Space>
          <Button
            type="default"
            onClick={downloadLiabilityReports}
            disabled={loading}
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
          <Button type="default" disabled>
            <FilePdfOutlined />
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
