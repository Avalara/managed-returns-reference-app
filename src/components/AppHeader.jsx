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

import PropTypes from 'prop-types';
import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/A-Check-RGB.svg';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = ({ brandingConfig }) => {
  const logoUrl = brandingConfig?.branding?.logoUrl || defaultLogo;
  const partnerName = brandingConfig?.branding?.partnerName || 'Avalara';

  return (
    <Header style={{ background: 'white', borderBottom: '1px solid #e8e8e8' }}>
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}
      >
        <img
          src={logoUrl}
          alt={`${partnerName} Logo`}
          style={{ height: 32, marginRight: 8 }}
        />
        <Title level={1}>{partnerName} Returns</Title>
      </Link>
    </Header>
  );
};

AppHeader.propTypes = {
  brandingConfig: PropTypes.shape({
    theme: PropTypes.object,
    branding: PropTypes.shape({
      partnerName: PropTypes.string,
      logoUrl: PropTypes.string,
      faviconUrl: PropTypes.string,
    }),
  }),
};

AppHeader.defaultProps = {
  brandingConfig: null,
};

export default AppHeader;
