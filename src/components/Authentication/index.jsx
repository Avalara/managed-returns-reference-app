import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  message,
  Select,
  Space,
  Typography,
} from 'antd';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { companies as COMPANIES } from '../../graphql/queries';
import { PageHeader } from '../shared';
import { authService } from '../../graphql/auth/index.js';

const { Content } = Layout;
const { Title } = Typography;

const Authentication = () => {
  const { isLoggedIn, setIsLoggedIn, setCompanyId } = useOutletContext();

  const [form] = Form.useForm();

  const [editCredentials, setEditCredentials] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(false);
  const [loading, setLoading] = useState(false);

  const [
    getCompanies,
    { loading: companiesCallIsLoading, error: companiesCallError, data },
  ] = useLazyQuery(COMPANIES);
  const companiesList = data?.companies?.value || [];

  if (companiesCallError) setIsLoggedIn(false);

  useEffect(() => {
    if (isLoggedIn) fetchCompanies(localStorage.getItem('clientId'));
  }, [isLoggedIn]);

  const fetchCompanies = async (accountId) => {
    if (accountId)
      await getCompanies({
        variables: { accountId: parseInt(accountId) },
      });
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Store credentials in localStorage
      localStorage.setItem('clientId', values.clientId);
      localStorage.setItem('clientSecret', values.clientSecret);

      // Force a new token request
      await authService.login();

      message.success('Successfully connected! Please select a company.');
      setEditCredentials(false);
      setEditCompanyId(true);
      fetchCompanies(values.clientId);
    } catch (error) {
      console.error('Connection failed:', error);
      message.error('Failed to connect. Please check your credentials.');
    } finally {
      setLoading(false);
      localStorage.removeItem('companyId');
      setCompanyId('');
      form.setFieldValue('companyId', '');
    }
  };
  const handleUpdateCompany = async () => {
    setEditCompanyId(!editCompanyId);
    const values = await form.validateFields();

    localStorage.setItem('companyId', values.companyId);
    setCompanyId(values.companyId);
    message.success('Successfully updated company!');
  };

  return (
    <div>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Title level={1}>Authentication</Title>
          <p>Enter your Avalara credentials to connect.</p>
        </Content>
      </PageHeader>

      <Content>
        <Layout>
          <Card title="Credentials">
            <Form
              form={form}
              layout="vertical"
              style={{ maxWidth: '500px' }}
              initialValues={{
                clientId: localStorage.getItem('clientId') || '',
                clientSecret: localStorage.getItem('clientSecret') || '',
                companyId: localStorage.getItem('companyId') || '',
              }}
            >
              <Form.Item
                name="clientId"
                label="Account number"
                rules={[
                  {
                    required: true,
                    message: 'Please input your account number!',
                  },
                ]}
              >
                <Input
                  placeholder="Client Id"
                  disabled={isLoggedIn && !editCredentials}
                />
              </Form.Item>

              <Form.Item
                name="clientSecret"
                label="License key"
                help="Enter your Avalara account license key."
                rules={[
                  {
                    required: true,
                    message: 'Please input your license key!',
                  },
                ]}
              >
                <Input.Password
                  placeholder="Input license key"
                  disabled={isLoggedIn && !editCredentials}
                />
              </Form.Item>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {isLoggedIn && !editCredentials ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      setEditCredentials(true);
                    }}
                  >
                    Edit Credentials
                  </Button>
                ) : (
                  <Space>
                    <Button
                      onClick={() => {
                        setEditCredentials(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleConnect}
                      loading={loading}
                    >
                      Connect
                    </Button>
                  </Space>
                )}
              </div>

              <div style={{ marginBottom: 24 }}></div>
              <Form.Item name="companyId" label="Company">
                <Select
                  allowClear
                  loading={companiesCallIsLoading}
                  disabled={!editCompanyId}
                  options={
                    companiesList
                      ? companiesList.map((c) => ({
                          value: '' + c.id,
                          label: '' + c.id,
                        }))
                      : []
                  }
                />
              </Form.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {!editCompanyId ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      setEditCompanyId(true);
                    }}
                    style={{
                      width: 84,
                    }}
                  >
                    Edit
                  </Button>
                ) : (
                  <Space>
                    <Button
                      onClick={() => {
                        setEditCompanyId(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="primary" onClick={handleUpdateCompany}>
                      Update
                    </Button>
                  </Space>
                )}
              </div>
            </Form>
          </Card>
        </Layout>
      </Content>
    </div>
  );
};

export default Authentication;
