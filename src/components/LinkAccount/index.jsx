import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button, Row, Col, App } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';
import { authService } from '../../graphql/auth';
import { createFirmClientLinkage as CREATE_FIRM_CLIENT_LINKAGE } from '../../graphql/mutations';
import { PageHeader } from '../shared/index.js';
import { Content } from 'antd/es/layout/layout.js';
import BreadcrumbMenu from '../BreadCrumbMenu.jsx';

const { Title, Text } = Typography;

const LinkAccount = () => {
  const { accountId } = useOutletContext();
  const [linkingAccount, setLinkingAccount] = useState(false);
  const [createFirmClientLinkageMutation] = useMutation(
    CREATE_FIRM_CLIENT_LINKAGE
  );
  const { notification } = App.useApp();

  const onFinish = async (values) => {
    try {
      setLinkingAccount(true);
      // Generate custom JWT token using form values
      const clientAuthToken = await authService.generateAuthToken(
        values.clientAccountNumber,
        values.clientToken
      );

      const { data } = await createFirmClientLinkageMutation({
        variables: {
          firmAccountId: parseInt(accountId), // Use accountId from outlet context
          firmAccountName: 'AVATEST - Returns_Firm_Account', // TODO: fetch this from API
        },
        context: {
          headers: {
            authorization: `Bearer ${clientAuthToken}`,
          },
        },
      });

      if (data && data.createFirmClientLinkage) {
        notification.success({
          message: 'Account successfully linked',
          description: `Account ID ${data.createFirmClientLinkage.clientAccountId} has been linked.`,
        });
      }
    } catch (error) {
      console.error('Failed to link account:', error);
      notification.error({
        message: 'Account couldn’t be linked.',
        description: `Try relinking Account ID ${values.clientAccountNumber} again.`,
      });
    } finally {
      setLinkingAccount(false);
    }
  };

  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Row align="bottom">
            <Col lg={16}>
              <Title level={1}>Link accounts</Title>
              <p>Enter your Avalara credentials to connect.</p>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Card title="Account information">
        <Form name="link_account_form" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Client account number"
            name="clientAccountNumber"
            rules={[
              {
                required: true,
                message: 'Please input your account number!',
              },
            ]}
            style={{ maxWidth: 400 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Client token"
            name="clientToken"
            rules={[
              {
                required: true,
                message: 'Please input your partner token!',
              },
            ]}
            style={{ maxWidth: 400 }}
          >
            <Input.Password
              placeholder="input partner token"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={linkingAccount}>
              Link account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default LinkAccount; // Renamed from LinkAccountPage to LinkAccount
