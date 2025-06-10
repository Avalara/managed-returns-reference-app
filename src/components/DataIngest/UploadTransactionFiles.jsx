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

import {
  Button,
  Card,
  message,
  Select,
  Space,
  Typography,
  theme,
  Row,
  Col,
  Upload,
} from 'antd';
import {
  DownloadOutlined,
  InboxOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
const { Dragger } = Upload;
import { useOutletContext } from 'react-router-dom';
import {
  createTransaction as CREATE_TRANSACTIONS,
  createTransactionsSummary as CREATE_TRANSACTIONS_SUMMARY,
} from '../../graphql/mutations';
import { useMutation } from '@apollo/client';

const { Link } = Typography;

const emptyTransactionJson = [
  {
    addressLine1: '',
    city: '',
    county: '',
    region: '',
    country: '',
    postalCode: '',
    grossAmount: 0,
    exemptAmount: 0,
    taxableAmount: 0,
    taxRate: 0,
    taxAmount: 0,
    taxLevel: '',
    taxType: '',
    transactionCode: '',
    transactionDate: '',
  },
];

const exampleTransactionJson = [
  {
    addressLine1: '255 S King St',
    city: 'Seattle',
    county: 'King',
    region: 'WA',
    country: 'US',
    postalCode: '98104',
    grossAmount: 199.99,
    exemptAmount: 0,
    taxableAmount: 199.99,
    taxRate: 0.1025,
    taxAmount: 20.49,
    taxLevel: 'State',
    taxType: 'Sales',
    transactionCode: 'AL2100',
    transactionDate: '2025-03-15',
  },
  {
    addressLine1: '123 Main St',
    city: 'Los Angeles',
    county: 'Los Angeles',
    region: 'CA',
    country: 'US',
    postalCode: '90001',
    grossAmount: 349.5,
    exemptAmount: 50.0,
    taxableAmount: 299.5,
    taxRate: 0.095,
    taxAmount: 28.45,
    taxLevel: 'State',
    taxType: 'Sales',
    transactionCode: 'AL2100',
    transactionDate: '2025-03-16',
  },
];

const emptySummarizedLiabilityJson = [
  {
    year: 2025,
    month: 4,
    country: '',
    region: '',
    city: '',
    postalCode: '',
    taxType: '',
    grossAmount: 0,
    exemptAmount: 0,
    taxableAmount: 0,
    taxAmount: 0,
  },
];

const exampleSummarizedLiabilityJson = [
  {
    year: 2025,
    month: 3,
    country: 'US',
    region: 'WA',
    city: 'Seattle',
    postalCode: '98104',
    taxType: 'Sales',
    grossAmount: 5000.0,
    exemptAmount: 500.0,
    taxableAmount: 4500.0,
    taxAmount: 461.25,
  },
  {
    year: 2025,
    month: 3,
    country: 'US',
    region: 'CA',
    city: 'Los Angeles',
    postalCode: '90001',
    taxType: 'Sales',
    grossAmount: 3500.0,
    exemptAmount: 0.0,
    taxableAmount: 3500.0,
    taxAmount: 332.5,
  },
];

const UploadTransactionFiles = () => {
  const { companyId } = useOutletContext();

  const [importType, setImportType] = useState('transactions');
  const [fileList, setFileList] = useState([]);
  const { token } = theme.useToken();

  const [createTransactions] = useMutation(CREATE_TRANSACTIONS);
  const [createTransactionsSummary] = useMutation(CREATE_TRANSACTIONS_SUMMARY);

  const getImportTypeText = () =>
    importType === 'transactions' ? 'transaction' : 'summarized tax liability';

  const getEmptyJsonTemplate = () =>
    importType === 'transactions'
      ? emptyTransactionJson
      : emptySummarizedLiabilityJson;

  const getExampleJsonTemplate = () =>
    importType === 'transactions'
      ? exampleTransactionJson
      : exampleSummarizedLiabilityJson;

  const getTemplateFileName = () =>
    importType === 'transactions'
      ? 'transaction_template.json'
      : 'summarized_liability_template.json';

  const getExampleFileName = () =>
    importType === 'transactions'
      ? 'example_transactions.json'
      : 'example_summarized_liability.json';

  const handleFileRead = async (file) => {
    try {
      // Update file status to uploading
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: 'uploading',
          percent: 0,
        },
      ]);

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);

          // Update file status to processing
          setFileList([
            {
              uid: file.uid,
              name: file.name,
              status: 'uploading',
              percent: 50,
            },
          ]);

          // Call the appropriate mutation based on import type
          if (importType === 'transactions') {
            await createTransactions({
              variables: {
                input: jsonContent,
                companyId: parseInt(companyId),
              },
            });
          } else {
            await createTransactionsSummary({
              variables: {
                input: jsonContent,
                companyId: parseInt(companyId),
              },
            });
          }

          // Update file status to done
          setFileList([
            {
              uid: file.uid,
              name: file.name,
              status: 'done',
              percent: 100,
            },
          ]);

          message.success(`${file.name} processed successfully.`);
        } catch (parseError) {
          // Update file status to error
          setFileList([
            {
              uid: file.uid,
              name: file.name,
              status: 'error',
              percent: 0,
              response: parseError.message,
            },
          ]);

          message.error(`Error parsing JSON file: ${parseError.message}`);
        }
      };

      reader.onerror = () => {
        // Update file status to error
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: 'error',
            percent: 0,
            response: 'Failed to read file',
          },
        ]);

        message.error(`Error reading file: ${file.name}`);
      };

      reader.readAsText(file);
    } catch (error) {
      // Update file status to error
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: 'error',
          percent: 0,
          response: error.message,
        },
      ]);

      message.error(`Error processing file: ${error.message}`);
    }
  };
  return (
    <Card title="Upload files">
      <Space direction="horizontal">
        <Select
          dropdownStyle={{
            width: 400,
          }}
          style={{
            width: 400,
          }}
          title={'Import type'}
          value={importType}
          options={[
            { value: 'transactions', label: 'Transactions' },
            {
              value: 'taxLiability',
              label: 'Summarized tax liability',
            },
          ]}
          onChange={(value) => {
            setImportType(value);
          }}
        />
        <Button
          type="primary"
          ghost
          onClick={() => {
            // Create a Blob with the JSON data
            const emptyJson = JSON.stringify(getEmptyJsonTemplate(), null, 2);

            // Create a blob and download link
            const blob = new Blob([emptyJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = getTemplateFileName();
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          style={{
            width: 84,
          }}
        >
          <DownloadOutlined /> .json
        </Button>

        <Button
          type="primary"
          ghost
          onClick={() => {
            // Create a Blob with the example JSON data
            const exampleJson = JSON.stringify(
              getExampleJsonTemplate(),
              null,
              2
            );

            // Create a blob and download link
            const blob = new Blob([exampleJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = getExampleFileName();
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          style={{
            width: 171,
          }}
        >
          <DownloadOutlined /> Example file (.json)
        </Button>
      </Space>
      <Row>
        <Col lg={16}>
          <p>
            Copy your {getImportTypeText()} data to the .json import template,
            then upload the file. If you need help, check the example file or
            review the{' '}
            <Link
              href="https://knowledge.avalara.com/bundle/dqa1657870670369_dqa1657870670369/page/Import_transactions_template_guidelines_1.html#rco1650667473637"
              target="_blank"
              rel="noopener noreferrer"
            >
              import requirements
            </Link>
            .
          </p>
        </Col>
      </Row>
      <Dragger
        name="file"
        multiple={false}
        accept=".json"
        fileList={fileList}
        beforeUpload={(file) => {
          handleFileRead(file);
          return false; // Prevent default upload behavior
        }}
        onDrop={(e) => {
          // Process dropped files
          Array.from(e.dataTransfer.files).forEach((file) => {
            if (
              file.type === 'application/json' ||
              file.name.endsWith('.json')
            ) {
              handleFileRead(file);
            } else {
              message.error(`${file.name} is not a JSON file.`);
            }
          });
        }}
        itemRender={(originNode, file) => {
          // Custom rendering for file items
          let statusText = '';
          let statusIcon = null;

          if (file.status === 'uploading' && file.percent < 50) {
            statusText = 'Reading file...';
            statusIcon = (
              <LoadingOutlined
                style={{ color: token.colorPrimary, marginRight: 8 }}
                spin
              />
            );
          } else if (file.status === 'uploading' && file.percent >= 50) {
            statusText = 'Processing transactions...';
            statusIcon = (
              <LoadingOutlined
                style={{ color: token.colorPrimary, marginRight: 8 }}
                spin
              />
            );
          } else if (file.status === 'done') {
            statusText = 'Completed';
            statusIcon = (
              <CheckCircleOutlined
                style={{ color: token.colorSuccess, marginRight: 8 }}
              />
            );
          } else if (file.status === 'error') {
            statusText = `Error: ${file.response || 'Failed to process'}`;
            statusIcon = (
              <CloseCircleOutlined
                style={{ color: token.colorError, marginRight: 8 }}
              />
            );
          }

          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {statusIcon}
                <span>{file.name}</span>
              </div>
              <div>{statusText}</div>
            </div>
          );
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          File must be .json and fewer than 1,000,000 rows of data.
        </p>
      </Dragger>
    </Card>
  );
};

export default UploadTransactionFiles;
