import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const HomeContent = () => {
  const { isLoggedIn, companyId } = useOutletContext();

  useEffect(() => {
    if (
      (!isLoggedIn || !companyId) &&
      location.pathname !== '/developer-tools/authentication'
    ) {
      window.location.href = '/developer-tools/authentication';
    } else {
      window.location.href = '/returns/reconcile';
    }
  }, [companyId, isLoggedIn]);

  return <></>;
};

export default HomeContent;
