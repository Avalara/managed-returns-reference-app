import { Layout, Tabs, theme } from 'antd';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import TransactionImportHistory from './TransactionImportHistory.jsx';
import UploadTransactionFiles from './UploadTransactionFiles.jsx';

const { Content } = Layout;

const items = [
  {
    key: 'upload',
    label: 'Upload files',
    children: <UploadTransactionFiles />,
  },
  {
    key: 'history',
    label: 'Import history',
    children: <TransactionImportHistory />,
  },
];

const onChange = (key) => {
  console.log(key);
};

const DataIngest = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <div
        style={{
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
        <Layout></Layout>
      </Content>
    </>
  );
};

export default DataIngest;
