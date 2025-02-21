import {
  Button,
  Card,
  Layout,
  message,
  Select,
  Space,
  Tabs,
  theme,
  Upload,
} from 'antd';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import ImportHistory from './ImportHistory';
import { useState } from 'react';
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Dragger } = Upload;

const items = [
  {
    key: 'upload',
    label: 'Upload files',
    children: <Upload />,
  },
  {
    key: 'history',
    label: 'Import history',
    children: <ImportHistory />,
  },
];

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

const onChange = (key) => {
  console.log(key);
};

const DataIngest = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const [importType, setImportType] = useState('transactions');

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          marginLeft: '-24px',
          padding: '24px',
        }}
      >
        <BreadcrumbMenu />
        <Content>
          <h1>Data Ingest</h1>
          <p>Import transaction data, or summarized tax liability.</p>
          <Tabs defaultActiveKey="upload" items={items} onChange={onChange} />
        </Content>
      </div>
      <Content
        style={{
          margin: 0,
          minHeight: 280,
          borderRadius: borderRadiusLG,
        }}
      >
        <Layout>
          <Card
            title="Upload files"
            bordered={false}
            style={{
              boxShadow: 'none',
              marginTop: 20,
              width: '100%',
            }}
          >
            <Space direction="horizontal">
              <Select
                // disabled={!companies || companies.length === 1}
                dropdownStyle={{
                  width: 400,
                }}
                style={{
                  width: 400,
                }}
                title={'Import type'}
                value={importType}
                options={[
                  { value: 'transactions', label: <span>Transactions</span> },
                  {
                    value: 'taxLiability',
                    label: <span>Summarized tax liability</span>,
                  },
                ]}
                onChange={(value) => {
                  setImportType(value);
                }}
              />
              <Button
                // color="primary"
                variant="outlined"
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
                // color="primary"
                variant="outlined"
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
                // color="primary"
                variant="outlined"
                onClick={() => {
                  console.log('example file');
                }}
                style={{
                  width: 171,
                }}
              >
                <DownloadOutlined /> Example file (.xlsx)
              </Button>
              {/* <Input
            value={companyIdFormValue}
            onChange={(e) => {
              setCompanyIdFormValue('' + e.target.value);
            }}
            style={{
              width: 400,
            }}
          /> */}
            </Space>
            <p>
              {importType == 'transactions'
                ? 'Copy your transaction data to one of the import templates, then upload the file. If you need help, check the example file or review the import requirements.'
                : 'Copy your summarized tax liability data to one of the import templates, then upload the file. If you need help, check the example file or review the import requirements.'}
            </p>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                File must be .csv or .xlsx, under 28MB, and fewer than 100,000
                rows of data.
              </p>
            </Dragger>
          </Card>
        </Layout>
      </Content>
    </>
  );
};

export default DataIngest;
