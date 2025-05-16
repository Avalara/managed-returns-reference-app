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

import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Table,
  Button,
  Space,
  Result,
  Badge,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { PageHeader } from '../shared';
import BreadcrumbMenu from '../BreadCrumbMenu';
import { companyFundingStatus as COMPANY_FUNDING_STATUS } from '../../graphql/queries';
import { useOutletContext, useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Funding = () => {
  const { companyId } = useOutletContext();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(COMPANY_FUNDING_STATUS, {
    variables: { companyId: parseInt(companyId) },
  });

  const handleCreatePowerOfAttorney = () => {
    navigate('/returns/create-funding');
  };

  // Extract unique values for filters
  const fundingStatusData = data?.companies?.value?.[0]?.fundingStatus
    ? data.companies.value[0].fundingStatus
    : [];

  const senderOptions = [
    ...new Set(fundingStatusData.map((item) => item.sender)),
  ]
    .filter(Boolean)
    .map((sender) => ({ text: sender, value: sender }));

  const statusOptions = ['Signed', 'Out for Signature'].map((status) => ({
    text: status,
    value: status,
  }));

  const columns = [
    {
      title: 'Signed by',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: 'Currency code',
      dataIndex: 'currency',
      key: 'currency',
      sorter: (a, b) => a.currency.localeCompare(b.currency),
    },
    {
      title: 'Requested by',
      dataIndex: 'sender',
      key: 'sender',
      sorter: (a, b) => a.sender.localeCompare(b.sender),
      filters: senderOptions,
      onFilter: (value, record) => record.sender === value,
    },
    {
      title: 'Date signed',
      dataIndex: 'lastSigned',
      key: 'lastSigned',
      render: (text) => (text ? new Date(text).toLocaleDateString() : ''),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: statusOptions,
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default';
        if (status === 'Signed') {
          color = 'success';
        } else if (status === 'Out for signature') {
          color = 'processing';
        }
        return <Badge status={color} text={status} />;
      },
    },
  ];

  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Row align="bottom">
            <Col lg={16}>
              <Title level={1}>Funding power of attorney</Title>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          <Card>
            {error ? (
              <Result
                status="500"
                title="Error"
                subTitle="We are having a momentary issue. Please try again in some time."
              />
            ) : (
              <Space
                direction="vertical"
                size="middle"
                style={{ display: 'flex' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Title level={2} style={{ margin: 0 }}></Title>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreatePowerOfAttorney}
                  >
                    Create a power of attorney
                  </Button>
                </div>

                <Table
                  dataSource={fundingStatusData}
                  columns={columns}
                  rowKey="documentKey"
                  loading={loading}
                />
              </Space>
            )}
          </Card>
        </Layout>
      </Content>
    </>
  );
};

Funding.propTypes = {
  // Add any props here if needed
};

export default Funding;
