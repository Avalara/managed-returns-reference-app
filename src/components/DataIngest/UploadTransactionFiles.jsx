import { Button, Card, message, Select, Space, Typography } from 'antd';
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Dragger from 'antd/es/upload/Dragger.js';

const { Link } = Typography;

const props = {
  name: 'file',
  multiple: true,
  action: '',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const UploadTransactionFiles = () => {
  const [importType, setImportType] = useState('transactions');

  const getImportTypeText = () =>
    importType === 'transactions' ? 'transaction' : 'summarized tax liability';

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
            console.log('csv');
          }}
          style={{
            width: 84,
          }}
        >
          <DownloadOutlined /> .csv
        </Button>
        <Button
          type="primary"
          ghost
          onClick={() => {
            console.log('xlsx');
          }}
          style={{
            width: 84,
          }}
        >
          <DownloadOutlined /> .xlsx
        </Button>
        <Button
          type="primary"
          ghost
          onClick={() => {
            console.log('example file');
          }}
          style={{
            width: 171,
          }}
        >
          <DownloadOutlined /> Example file (.xlsx)
        </Button>
      </Space>
      <p>
        Copy your {getImportTypeText()} data to one of the import templates,
        then upload the file. If you need help, check the example file or review
        the{' '}
        <Link
          href="https://knowledge.avalara.com/bundle/dqa1657870670369_dqa1657870670369/page/Import_transactions_template_guidelines_1.html#rco1650667473637"
          target="_blank"
          rel="noopener noreferrer"
        >
          import requirements
        </Link>
        .
      </p>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          File must be .csv or .xlsx, under 28MB, and fewer than 100,000 rows of
          data.
        </p>
      </Dragger>
    </Card>
  );
};

export default UploadTransactionFiles;
