import { Card, Layout, theme, Button, Space, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import SetUpReturnsTable from './SetUpReturnsTable.jsx';
import { useOutletContext } from 'react-router-dom';

const { Content } = Layout;

const SetUpReturns = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const { companyId } = useOutletContext();

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
          <h1>Set up returns</h1>
          <p>
            These are the states where you’re registered to report tax, based on
            your tax profile.
          </p>
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
            bordered={false}
            style={{
              boxShadow: 'none',
              width: '100%',
            }}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: 'flex' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ margin: 0 }}>States where you report tax</h2>
                <Button icon={<PlusOutlined />}>Add states</Button>
              </div>
              <Alert
                description="The data shown in this table is mock data for demonstration purposes and does not reflect actual API responses."
                type="info"
                showIcon
              />
              <div>
                <SetUpReturnsTable companyId={companyId} />
              </div>
            </Space>
          </Card>
        </Layout>
      </Content>
    </>
  );
};

export default SetUpReturns;
