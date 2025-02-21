import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SettingOutlined, TableOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';

const { Header, Sider } = Layout;

const localStorageClientId = localStorage.getItem('clientId');
const localStorageClientSecret = localStorage.getItem('clientSecret');
const localStorageCompanyId = localStorage.getItem('companyId');

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorageClientId && !!localStorageClientSecret
  );
  const [companyId, setCompanyId] = useState(localStorageCompanyId);

  const [selectedKeys, setSelectedKeys] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathKeys = location.pathname.split('/').filter((key) => key);
    setSelectedKeys([pathKeys[pathKeys.length - 1] || '/']);
  }, [location.pathname]);

  useEffect(() => {
    const clientId = localStorage.getItem('clientId');
    const clientSecret = localStorage.getItem('clientSecret');
    if (!clientId || !clientSecret) {
      console.log('clientId', clientId, 'clientSecret', clientSecret);
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const menuItems = [
    {
      key: 'returns',
      icon: <TableOutlined />,
      label: `Tax returns`,
      children: [
        {
          key: 'get-started',
          label: 'Get started',
        },
        {
          key: 'reconcile',
          label: 'Reconcile',
        },
        {
          key: 'set-up-returns',
          label: 'Set up returns',
        },
        {
          key: 'funding',
          label: 'Set up funding',
        },
      ],
      onClick: (e) => {
        console.log(e);
        navigate(e.keyPath.reverse().join('/'));
      },
    },
    {
      key: 'developer-tools',
      icon: <SettingOutlined />,
      label: `Developer tools`,
      children: [
        {
          key: 'authentication',
          label: 'Authentication',
        },
        {
          key: 'provisioning',
          label: 'Provisioning',
        },
        {
          key: 'data-ingest',
          label: 'Data ingest',
        },
      ],
      onClick: (e) => {
        console.log(e);
        navigate(e.keyPath.reverse().join('/'));
      },
    },
  ];

  useEffect(() => {
    if (
      (!isLoggedIn || !localStorageCompanyId) &&
      location.pathname !== '/developer-tools/authentication'
    ) {
      window.location.href = '/developer-tools/authentication';
    }
  }, [location.pathname, isLoggedIn]);

  const defaultOpenMenuItem =
    location.pathname.indexOf('developer-tools') > -1
      ? 'developer-tools'
      : 'returns';

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: 'Avalara Returns',
              label: `Avalara Returns`,
            },
          ]}
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
          breakpoint="md"
          collapsedWidth={0}
        >
          <Menu
            mode="inline"
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={menuItems}
            defaultOpenKeys={[defaultOpenMenuItem]}
            onClick={(e) => {
              setSelectedKeys([e.key]);
            }}
            selectedKeys={selectedKeys}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          {/* <Header
            style={{
              backgroundColor: 'white',
              marginLeft: '-24px',
              paddingTop: '24px',
            }}
          >
            <BreadcrumbMenu />
          </Header>

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: borderRadiusLG,
            }}
          >
            <Layout
              style={{
                padding: '24px 0',
              }}
            > */}
          <Outlet
            context={{
              isLoggedIn,
              setIsLoggedIn,
              companyId,
              setCompanyId,
            }}
          />
          {/* </Layout>
          </Content> */}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
