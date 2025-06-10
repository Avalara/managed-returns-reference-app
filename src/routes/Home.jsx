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

import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import {
  loadBrandingConfig,
  updateDocumentTitle,
  updateFavicon,
} from '../components/CustomBrandingSettings/brandingConfig.js';

const { Content, Footer } = Layout;

const localStorageClientId = localStorage.getItem('clientId');
const localStorageClientSecret = localStorage.getItem('clientSecret');
const localStorageCompanyId = localStorage.getItem('companyId');

const Home = () => {
  const [brandingConfig, setBrandingConfig] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorageClientId && !!localStorageClientSecret
  );
  const [accountId, setAccountId] = useState(localStorageClientId);
  const [companyId, setCompanyId] = useState(localStorageCompanyId);

  const navigate = useNavigate();
  const location = useLocation();

  // Load branding configuration on component mount
  useEffect(() => {
    const config = loadBrandingConfig();
    setBrandingConfig(config);

    // Update favicon if provided
    updateFavicon(config.branding.faviconUrl);

    // Update document title with partner name
    updateDocumentTitle(config.branding.partnerName);
  }, []);

  // Original authentication check from the original Home component
  useEffect(() => {
    const clientId = localStorageClientId;
    const clientSecret = localStorageClientSecret;
    if (!clientId || !clientSecret) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ConfigProvider theme={{ token: brandingConfig?.theme }}>
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader brandingConfig={brandingConfig} />
        <Layout>
          <Sidebar brandingConfig={brandingConfig} companyId={companyId} />
          <Layout style={{ padding: '24px' }}>
            <Content>
              <Outlet
                context={{
                  isLoggedIn,
                  setIsLoggedIn,
                  accountId,
                  companyId,
                  setAccountId,
                  setCompanyId,
                }}
              />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              {brandingConfig?.branding?.partnerName || 'Avalara'} Returns
              Reference App ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Home;
