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
import { Layout, Typography } from 'antd';
import BrandingPanel from './BrandingPanel.jsx';
import { PageHeader } from '../shared/index.js';
import BreadcrumbMenu from '../BreadCrumbMenu.jsx';
import { Content } from 'antd/es/layout/layout.js';
import { updateDocumentTitle, updateFavicon } from './brandingConfig.js';

const { Title } = Typography;

const Index = () => {
  const handleConfigUpdate = (newConfig) => {
    // Update document title with partner name
    updateDocumentTitle(newConfig.branding.partnerName);

    // Update favicon if provided
    updateFavicon(newConfig.branding.faviconUrl);

    // Force a page reload to apply the new theme
    window.location.reload();
  };

  return (
    <div>
      <PageHeader>
        <BreadcrumbMenu />
        <Title level={2}>Branding Settings</Title>
        <p>Customize the application&#39;s appearance and branding.</p>
      </PageHeader>
      <Content>
        <Layout>
          <BrandingPanel onConfigUpdate={handleConfigUpdate} />
        </Layout>
      </Content>
    </div>
  );
};

Index.propTypes = {};

export default Index;
