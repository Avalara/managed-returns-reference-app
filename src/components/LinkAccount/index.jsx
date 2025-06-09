import React from 'react';
import {
  Typography,
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  notification,
} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';
import { createFirmClientLinkage as CREATE_FIRM_CLIENT_LINKAGE } from '../../graphql/mutations';
import { PageHeader } from '../shared/index.js';
import { Content } from 'antd/es/layout/layout.js';
import BreadcrumbMenu from '../BreadCrumbMenu.jsx';

const { Title, Text } = Typography;

const LinkAccount = () => {
  const { accountId } = useOutletContext();
  const [createFirmClientLinkageMutation, { loading }] = useMutation(
    CREATE_FIRM_CLIENT_LINKAGE
  );

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    try {
      const { data } = await createFirmClientLinkageMutation({
        variables: {
          firmAccountId: accountId, // Use accountId from outlet context
          firmAccountName: 'AVATEST - Returns_Firm_Account', // TODO: fetch this from API
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
        message: 'Account couldn’t be relinked.',
        description: `Try relinking Account ID ${values.accountNumber} again.`,
      });
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
            label="Account number"
            name="accountNumber"
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
            label="Partner token"
            name="partnerToken"
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Link account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default LinkAccount; // Renamed from LinkAccountPage to LinkAccount
