import React, { useEffect, useState } from 'react';
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
  useMatches,
} from 'react-router-dom';
import { SettingOutlined, TableOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Sider } = Layout;

const localStorageClientId = localStorage.getItem('clientId');
const localStorageClientSecret = localStorage.getItem('clientSecret');
const localStorageCompanyId = localStorage.getItem('companyId');

const BreadcrumbMenu = () => {
  const location = useLocation();
  const snippets = location.pathname.split('/').filter((key) => key);
  // console.log('snippets', snippets);
  // const matches = useMatches();
  // console.log('matches', matches);

  const items = [
    {
      path: '/',
      title: 'Returns',
      children: [
        {
          path: '/get-started',
          title: 'Get started',
        },
        {
          path: '/reconcile',
          title: 'Reconcile',
        },
        {
          path: '/set-up-returns',
          title: 'Set up returns',
        },
        {
          path: '/funding',
          title: 'Set up funding',
        },
      ],
    },
  ];

  function itemRender(currentRoute, params, items, paths) {
    // console.log('currentRoute', currentRoute);
    // console.log('params', params);
    // console.log('paths', paths);

    return snippets.map((snippet, snippetIdx) =>
      snippetIdx === snippets.length - 1 ? (
        <span key={snippetIdx}>{snippet}</span>
      ) : (
        <Link key={snippetIdx} to={`/${paths.join('/')}`}>
          {currentRoute.title}
        </Link>
      ),
    );
  }

  return (
    <Breadcrumb
      itemRender={itemRender}
      items={items}
      params={location.pathname}
    />
  );
};

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorageClientId && !!localStorageClientSecret,
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
        navigate(e.keyPath.reverse().join('/')); // TODO: refactor the children key names and how this onClick works
      },
    },
    {
      key: 'developer',
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
        navigate(e.keyPath.reverse().join('/')); // TODO: refactor the children key names and how this onClick works
      },
    },
  ];

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/developer/authentication') {
      window.location.href = '/developer/authentication';
    }
  }, [location.pathname, isLoggedIn]);

  const defaultOpenMenuItem =
    location.pathname.indexOf('developer') > -1 ? 'developer' : 'returns';

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
          {/* <BreadcrumbMenu /> */}
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
            >
              <Outlet
                context={{
                  isLoggedIn,
                  setIsLoggedIn,
                  companyId,
                  setCompanyId,
                }}
              />
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
