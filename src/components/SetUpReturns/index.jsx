import { Card, Layout, theme, Button, Space, Alert, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import SetUpReturnsTable from './SetUpReturnsTable.jsx';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../shared';

const { Content } = Layout;
const { Title } = Typography;

const SetUpReturns = () => {
  const { companyId } = useOutletContext();

  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Title level={1}>Set up returns</Title>
        <p>
          These are the states where you&#39;re registered to report tax, based
          on your tax profile.
        </p>
      </PageHeader>
      <Content>
        <Layout>
          <Card>
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
                <Title level={2} style={{ margin: 0 }}>
                  States where you report tax
                </Title>
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
