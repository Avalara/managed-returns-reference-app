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
import { createTransaction as CREATE_TRANSACTIONS } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';

const { Link } = Typography;

const emptyTransactionJson = [
  {
    transactionDate: '',
    country: '',
    region: '',
    addressLine1: '',
    county: '',
    city: '',
    postalCode: '',
    taxType: '',
    taxLevel: '',
    taxRate: 0,
    grossAmount: 0,
    exemptAmount: 0,
    taxableAmount: 0,
    taxAmount: 0,
  },
];

const exampleTransactionJson = [
  {
    transactionDate: '2025-03-15',
    country: 'US',
    region: 'WA',
    addressLine1: '255 S King St',
    county: 'King',
    city: 'Seattle',
    postalCode: '98104',
    taxType: 'Sales',
    taxLevel: 'State',
    taxRate: 0.1025,
    grossAmount: 199.99,
    exemptAmount: 0,
    taxableAmount: 199.99,
    taxAmount: 20.5,
  },
  {
    transactionDate: '2025-03-16',
    country: 'US',
    region: 'CA',
    addressLine1: '123 Main St',
    county: 'Los Angeles',
    city: 'Los Angeles',
    postalCode: '90001',
    taxType: 'Sales',
    taxLevel: 'State',
    taxRate: 0.095,
    grossAmount: 349.5,
    exemptAmount: 50.0,
    taxableAmount: 299.5,
    taxAmount: 28.45,
  },
];

const UploadTransactionFiles = () => {
  const { companyId } = useOutletContext();

  const [importType, setImportType] = useState('transactions');
  const [fileList, setFileList] = useState([]);
  const { token } = theme.useToken();

  const [createTransactions] = useMutation(CREATE_TRANSACTIONS);

  const getImportTypeText = () =>
    importType === 'transactions' ? 'transaction' : 'summarized tax liability';

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

          // Call the createTransactions mutation with the file content
          await createTransactions({
            variables: {
              input: jsonContent,
              companyId: parseInt(companyId),
            },
          });

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
            const emptyJson = JSON.stringify(emptyTransactionJson, null, 2);

            // Create a blob and download link
            const blob = new Blob([emptyJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'transaction_template.json';
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
            const exampleJson = JSON.stringify(exampleTransactionJson, null, 2);

            // Create a blob and download link
            const blob = new Blob([exampleJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'example_transactions.json';
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
          console.log('Dropped files', e.dataTransfer.files);
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
