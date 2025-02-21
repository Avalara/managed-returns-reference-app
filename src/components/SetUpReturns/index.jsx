import { Card, Layout, theme } from 'antd';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';

const { Content } = Layout;

const SetUpReturns = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

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
          <h1>Set up returns</h1>
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
              marginTop: 20,
              width: '100%',
            }}
          ></Card>
        </Layout>
      </Content>
    </>
  );
};

export default SetUpReturns;
