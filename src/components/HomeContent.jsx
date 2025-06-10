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

import { useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';

const HomeContent = () => {
  const { isLoggedIn } = useOutletContext() || {
    isLoggedIn: false,
  };
  const location = useLocation();

  useEffect(() => {
    if (
      !isLoggedIn &&
      location.pathname !== '/developer-tools/authentication'
    ) {
      window.location.href = '/developer-tools/authentication';
    }
  }, [isLoggedIn, location.pathname]);

  return <></>;
};

export default HomeContent;
