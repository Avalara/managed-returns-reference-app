/*
 * Contents of this file was produced with a help of a code generation tool and
 * subsequently reviewed and edited by a human.
 *
 * While some of the code was created by an AI assisted service, manual adjustments
 * have been made to ensure correctness, readability, functionality and compliance
 * to Avalara's coding standards and guidelines.
 * Any future modifications should be approached with caution to avoid
 * overwriting the manual changes.
 *
 *
 * This source code is owned by Avalara Inc. Unauthorized copying of this file,
 * via any medium, is strictly prohibited. Proprietary and confidential.
 *
 * For more information, refer to the documentation or contact the development team.
 */

import { useState } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ brandingConfig, companyId }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Get the primary color from branding config or use default
  const primaryColor = brandingConfig?.theme?.colorPrimary || '#1677ff';

  // Determine which keys should be selected based on current path
  const getSelectedKeys = () => {
    const path = location.pathname;

    if (path === '/') return ['home'];
    if (path.includes('/returns/reconcile')) return ['returns-reconcile'];
    if (path.includes('/returns/funding')) return ['returns-funding'];
    if (path.includes('/returns/create-funding')) return ['returns-funding'];
    if (path.includes('/returns/set-up-returns')) return ['returns-setup'];
    if (path.includes('/returns/select-states')) return ['returns-setup'];
    if (path.includes('/returns/get-started')) return ['returns-get-started'];
    if (path.includes('/developer-tools/authentication'))
      return ['dev-authentication'];
    if (path.includes('/developer-tools/provisioning'))
      return ['dev-provisioning'];
    if (path.includes('/developer-tools/data-ingest'))
      return ['dev-data-ingest'];
    if (path.includes('/developer-tools/link-account'))
      return ['dev-link-account'];
    if (path.includes('/developer-tools/branding-settings'))
      return ['dev-branding-settings'];

    return [];
  };

  // Determine which keys should be open based on current path
  const getOpenKeys = () => {
    const path = location.pathname;

    if (path.includes('/returns')) return ['returns'];
    if (path.includes('/developer-tools')) return ['developer-tools'];

    return [];
  };

  const taxReturnLinks = [
    {
      key: 'returns-get-started',
      labelContent: 'Get started',
      path: '/returns/get-started',
    },
    {
      key: 'returns-reconcile',
      labelContent: 'Reconcile',
      path: '/returns/reconcile',
    },
    {
      key: 'returns-setup',
      labelContent: 'Set up returns',
      path: '/returns/set-up-returns',
    },
    {
      key: 'returns-funding',
      labelContent: 'Funding',
      path: '/returns/funding',
    },
  ];

  const processedTaxReturnItems = taxReturnLinks.map((item) => ({
    key: item.key,
    disabled: !companyId,
    label: !companyId ? (
      <Tooltip title="A company selection is required to access Tax Returns.">
        <span>{item.labelContent}</span>
      </Tooltip>
    ) : (
      <Link to={item.path}>{item.labelContent}</Link>
    ),
  }));

  const menuItems = [
    {
      key: 'returns',
      icon: <TableOutlined />,
      label: 'Tax returns',
      children: processedTaxReturnItems,
    },
    {
      key: 'developer-tools',
      icon: <SettingOutlined />,
      label: 'Developer tools',
      children: [
        {
          key: 'dev-authentication',
          label: (
            <Link to="/developer-tools/authentication">Authentication</Link>
          ),
        },
        {
          key: 'dev-provisioning',
          label: <Link to="/developer-tools/provisioning">Provisioning</Link>,
        },
        {
          key: 'dev-data-ingest',
          label: <Link to="/developer-tools/data-ingest">Data ingest</Link>,
        },
        {
          key: 'dev-link-account',
          label: <Link to="/developer-tools/link-account">Link account</Link>,
        },
        {
          key: 'dev-branding-settings',
          label: (
            <Link to="/developer-tools/branding-settings">
              Branding settings
            </Link>
          ),
        },
      ],
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      width={240}
      trigger={
        collapsed ? (
          <MenuUnfoldOutlined style={{ color: primaryColor }} />
        ) : (
          <MenuFoldOutlined style={{ color: primaryColor }} />
        )
      }
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        style={{ height: '100%' }}
        items={menuItems}
      />
    </Sider>
  );
};

Sidebar.propTypes = {
  brandingConfig: PropTypes.shape({
    theme: PropTypes.shape({
      colorPrimary: PropTypes.string,
    }),
    branding: PropTypes.shape({
      partnerName: PropTypes.string,
    }),
  }),
  companyId: PropTypes.string,
};

export default Sidebar;
