import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button, Input, Typography } from 'antd';

const HomeContent = () => {
  const { isLoggedIn, setIsLoggedIn, companyId, setCompanyId } =
    useOutletContext();
  const [companyIdFormValue, setCompanyIdFormValue] = useState(companyId);

  return (
    <div>
      <h1>Home Content</h1>
      {isLoggedIn ? (
        <button
          onClick={() => {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }}
        >
          Log out
        </button>
      ) : (
        <button
          onClick={() => console.log('did not log in. need to open modal')}
        >
          Log in
        </button>
      )}
      <br />
      <Typography.Title level={5}>Company Id:</Typography.Title>
      <Input
        value={companyIdFormValue}
        onChange={(e) => {
          setCompanyIdFormValue('' + e.target.value);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          setCompanyId(companyIdFormValue);
          localStorage.setItem('companyId', companyIdFormValue);
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default HomeContent;
