import { useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Typography } from 'antd';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

import query from '../../graphql/queries';

const Authentication = () => {
  const { isLoggedIn, setIsLoggedIn, companyId, setCompanyId } =
    useOutletContext();
  const [companyIdFormValue, setCompanyIdFormValue] = useState(companyId);

  const [clientId, setClientId] = useState(localStorage.getItem('clientId'));
  const [clientSecret, setClientSecret] = useState(
    localStorage.getItem('clientSecret'),
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [
    getCompanies,
    {
      // called,
      // error,
      companiesCallIsLoading,
      // data,
    },
  ] = useLazyQuery(query.Companies);
  const [companies, setCompanies] = useState();
  console.log('companiesCallIsLoading', companiesCallIsLoading);

  useEffect(() => {
    const getCompanyIds = async () => {
      console.log('getting company ids');
      const { data } = await getCompanies({
        variables: { accountId: parseInt(clientId) },
      });
      console.log('company data', data);

      setCompanies(data.companies);
    };
    if (isLoggedIn) {
      console.log('is logged in, getting companies');
      getCompanyIds();
    } else {
      console.log('not logged in');
    }
  }, [isLoggedIn, getCompanies]);

  return (
    <div>
      <h1>Authentication</h1>
      <p>Enter your Avalara credentials to connect.</p>

      <Card bordered={false} style={{ boxShadow: 'none' }}>
        <h2>Credentials</h2>
        <Typography.Title level={5}>Account number</Typography.Title>
        <Input
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
          }}
          placeholder="Client Id"
          style={{
            width: 400,
          }}
        />
        <br />
        <br />
        <Typography.Title level={5}>License key</Typography.Title>
        <Space direction="horizontal">
          <Input.Password
            value={clientSecret}
            onChange={(e) => {
              setClientSecret(e.target.value);
            }}
            placeholder="input license key"
            iconRender={(passwordVisible) =>
              passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            style={{
              width: 400,
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              localStorage.setItem('clientId', clientId);
              localStorage.setItem('clientSecret', clientSecret);
              setIsLoggedIn(true);
            }}
            disabled={!clientId || !clientSecret}
            style={{
              width: 84,
            }}
          >
            Connect
          </Button>
        </Space>

        <Typography.Title level={5}>
          Enter your Avalara account license key.
        </Typography.Title>
        <Typography.Title level={5}>Company</Typography.Title>
        <Space direction="horizontal">
          <Input
            value={companyIdFormValue}
            onChange={(e) => {
              setCompanyIdFormValue('' + e.target.value);
            }}
            style={{
              width: 400,
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              setCompanyId(companyIdFormValue);
              localStorage.setItem('companyId', companyIdFormValue);
            }}
            style={{
              width: 84,
            }}
            disabled={!companyIdFormValue || !isLoggedIn}
          >
            Save
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Authentication;
