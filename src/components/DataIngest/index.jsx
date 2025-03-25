import { Layout, Tabs, theme } from 'antd';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import TransactionImportHistory from './TransactionImportHistory.jsx';
import UploadTransactionFiles from './UploadTransactionFiles.jsx';
import { PageHeader } from '../shared';
import { useState } from 'react';

const { Content } = Layout;

const items = [
  {
    key: 'upload',
    label: 'Upload files',
  },
  {
    key: 'history',
    label: 'Import history',
  },
];

const DataIngest = () => {
  const [view, setView] = useState('upload');
  const onChange = (key) => {
    setView(key);
  };
  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <h1>Data Ingest</h1>
          <p>Import transaction data, or summarized tax liability.</p>
          <Tabs
            defaultActiveKey="upload"
            items={items}
            onChange={onChange}
            style={{
              marginBottom: '-40px',
            }}
          />
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          {view === 'upload' && <UploadTransactionFiles />}
          {view === 'history' && <TransactionImportHistory />}
        </Layout>
      </Content>
    </>
  );
};

export default DataIngest;
