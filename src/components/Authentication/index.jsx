import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  Layout,
  Select,
  Space,
  theme,
  Typography,
} from 'antd';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import query from '../../graphql/queries';

const { Content } = Layout;

const Authentication = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const { isLoggedIn, setIsLoggedIn, companyId, setCompanyId } =
    useOutletContext();

  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId);

  const [clientId, setClientId] = useState(localStorage.getItem('clientId'));
  const [clientSecret, setClientSecret] = useState(
    localStorage.getItem('clientSecret'),
  );

  const [editClientId, setEditClientId] = useState(false);
  const [editClientSecret, setEditClientSecret] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [companies, setCompanies] = useState();

  const [
    getCompanies,
    { loading: companiesCallIsLoading, error: companiesCallError, data },
  ] = useLazyQuery(query.companies);

  if (companiesCallError) setIsLoggedIn(false);

  useEffect(() => {
    const getCompanyIds = async () => {
      setCompanies(['Loading...']);
      setSelectedCompanyId('Loading...');
      await getCompanies({
        variables: { accountId: parseInt(clientId) },
      });
    };
    if (isLoggedIn) {
      getCompanyIds();
    }
  }, [isLoggedIn, getCompanies, clientId, clientSecret]);

  useEffect(() => {
    if (data && data.companies) {
      const companies = data.companies.value;
      setCompanies(companies);
      if (companies.length) {
        const companyIds = companies.map((c) => c.id);
        if (companyIds.includes(parseInt(companyId))) {
          setSelectedCompanyId(companyId);
        } else {
          // setCompanyId(companyIds[0]);
          setSelectedCompanyId(companyIds[0]);
        }
      }
    }
  }, [data, companyId, setCompanyId]);

  return (
    <div>
      <div
        style={{
          backgroundColor: 'white',
          marginLeft: '-24px',
          padding: '24px',
        }}
      >
        <BreadcrumbMenu />
        <Content>
          <h1>Authentication</h1>
          <p style={{ marginBottom: 0 }}>
            Enter your Avalara credentials to connect.
          </p>
        </Content>
      </div>

      <Content
        style={{
          margin: 0,
          minHeight: 280,
          borderRadius: borderRadiusLG,
        }}
      >
        <Layout>
          <Card
            bordered={false}
            style={{
              boxShadow: 'none',
              marginTop: 20,
              width: '100%',
            }}
          >
            <h2>Credentials</h2>
            <Typography.Title level={5}>Account number</Typography.Title>
            <Space direction="horizontal">
              <Input
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                }}
                placeholder="Client Id"
                disabled={isLoggedIn && !editClientId}
                style={{
                  width: 400,
                }}
              />
              {isLoggedIn && !editClientId && (
                <Button
                  type="primary"
                  onClick={() => {
                    setEditClientId(true);
                  }}
                  style={{
                    width: 84,
                  }}
                >
                  Edit
                </Button>
              )}
              {editClientId && (
                <Button
                  type="primary"
                  onClick={() => {
                    localStorage.setItem('clientId', clientId);
                    setEditClientId(false);
                  }}
                  style={{
                    width: 84,
                  }}
                >
                  Update
                </Button>
              )}
            </Space>
            <br />
            <br />
            <Typography.Title level={5}>License key</Typography.Title>
            <Space direction="horizontal">
              <Input.Password
                value={clientSecret}
                onChange={(e) => {
                  setClientSecret(e.target.value);
                }}
                placeholder="Input license key"
                iconRender={(passwordVisible) =>
                  passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                disabled={isLoggedIn && !editClientSecret}
                style={{
                  width: 400,
                }}
              />
              {isLoggedIn && !editClientSecret && (
                <Button
                  type="primary"
                  onClick={() => {
                    setEditClientSecret(true);
                  }}
                  style={{
                    width: 84,
                  }}
                >
                  Edit
                </Button>
              )}
              {editClientSecret && (
                <Button
                  type="primary"
                  onClick={() => {
                    localStorage.setItem('clientSecret', clientSecret);
                    setEditClientSecret(false);
                  }}
                  style={{
                    width: 84,
                  }}
                >
                  Update
                </Button>
              )}
              {!isLoggedIn && (
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
              )}
            </Space>

            <Typography.Title level={5}>
              Enter your Avalara account license key.
            </Typography.Title>
            <Typography.Title level={5}>Company</Typography.Title>
            <Space direction="horizontal">
              <Select
                // disabled={!companies || companies.length === 1}
                disabled={
                  companiesCallIsLoading ||
                  !companies?.length ||
                  (!editCompanyId && !!companyId)
                }
                dropdownStyle={{
                  width: 400,
                }}
                style={{
                  width: 400,
                }}
                value={selectedCompanyId}
                options={
                  companies
                    ? companies.map((c) => {
                        return {
                          value: '' + c.id,
                          label: <span>{'' + c.id}</span>,
                        };
                      })
                    : [{ value: 'Loading...', label: <span>Loading...</span> }]
                }
                onChange={(value) => {
                  setSelectedCompanyId(value);
                }}
              />
              {/* <Input
            value={companyIdFormValue}
            onChange={(e) => {
              setCompanyIdFormValue('' + e.target.value);
            }}
            style={{
              width: 400,
            }}
          /> */}
              {companies && !editCompanyId && !!companyId && (
                <Button
                  type="primary"
                  onClick={() => {
                    setEditCompanyId(true);
                  }}
                  style={{
                    width: 84,
                  }}
                  disabled={companies.length === 1}
                >
                  Edit
                </Button>
              )}
              {editCompanyId && (
                <Button
                  type="primary"
                  onClick={() => {
                    localStorage.setItem('companyId', selectedCompanyId);
                    setCompanyId(selectedCompanyId);
                    setEditCompanyId(false);
                  }}
                  style={{
                    width: 84,
                  }}
                >
                  Update
                </Button>
              )}
              {!companyId && !companiesCallIsLoading && (
                <Button
                  type="primary"
                  onClick={() => {
                    setCompanyId(selectedCompanyId);
                    localStorage.setItem('companyId', selectedCompanyId);
                  }}
                  style={{
                    width: 84,
                  }}
                  disabled={!selectedCompanyId || !isLoggedIn}
                >
                  Save
                </Button>
              )}
            </Space>
          </Card>
        </Layout>
      </Content>
    </div>
  );
};

export default Authentication;
