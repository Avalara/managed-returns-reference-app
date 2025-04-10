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
  const [accountId, setAccountId] = useState(localStorageClientId);
  const [companyId, setCompanyId] = useState(localStorageCompanyId);

  const [selectedKeys, setSelectedKeys] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathKeys = location.pathname.split('/').filter((key) => key);
    setSelectedKeys([pathKeys[pathKeys.length - 1] || '/']);
  }, [location.pathname]);

  useEffect(() => {
    const clientId = localStorageClientId;
    const clientSecret = localStorageClientSecret;
    if (!clientId || !clientSecret) {
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
      <Header>
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
            fontWeight: '500',
          }}
        />
      </Header>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="md" collapsible theme={'light'}>
          <Menu
            mode="inline"
            style={{
              height: '100%',
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
            padding: '24px',
          }}
        >
          <Outlet
            context={{
              isLoggedIn,
              setIsLoggedIn,
              accountId,
              companyId,
              setCompanyId,
            }}
          />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
