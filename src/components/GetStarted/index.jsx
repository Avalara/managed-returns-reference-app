import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Flex,
  Layout,
  Row,
  Tag,
  theme,
  Typography,
  Modal,
  Radio,
  Input,
  Divider,
} from 'antd';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import PoaModal from '../POA/PoaModal';

const { Text } = Typography;
const { Content } = Layout;

const GetStartedCard = ({ title, status, text, onClick }) => {
  const statusTag = <Tag color="default">Not started</Tag>;

  return (
    <Card
      title={title}
      extra={statusTag}
      style={{
        marginTop: 20,
        flex: '1 0 320px',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          flex: '1 1 auto', // This makes the body take remaining space
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      actions={[
        <Button
          key={`${title}-1`}
          type="default"
          disabled={status !== 'notStarted'}
          onClick={onClick}
        >
          Start
        </Button>,
      ]}
    >
      <p>{text}</p>
    </Card>
  );
};

const GetStarted = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const [poaModalOpen, setPoaModalOpen] = useState(false);

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          marginLeft: '-24px',
          padding: '24px',
        }}
      >
        <BreadcrumbMenu />
        <Content>
          <Row align="bottom">
            <Col span={18} style={{ paddingRight: '24px' }}>
              <h1>Get started</h1>
              <p>
                Set up all the returns that you want Avalara to file for you and
                sign the funding power of attorney. When you’re ready, Avalara’s
                compliance team will review all your information before your
                first filing period.
              </p>
            </Col>
            <Col span={6}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text style={{ textAlign: 'right' }} type="secondary">
                  Progress
                </Text>
                <h2 style={{ textAlign: 'right', marginTop: 0 }}>
                  0 of 3 tasks complete
                </h2>
              </div>
            </Col>
          </Row>
        </Content>
      </div>
      <Content
        style={{
          margin: 0,
          minHeight: 500,
          borderRadius: borderRadiusLG,
        }}
      >
        <Layout>
          <Flex wrap="wrap" gap="middle" justify="flex-start">
            <GetStartedCard
              title="Set up returns"
              status="notStarted"
              text="You haven’t set up any returns."
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/returns/set-up-returns';
              }}
            />
            <GetStartedCard
              title="Sign funding power of attorney"
              status="notStarted"
              text="This is required so that Avalara can make tax payments to tax
                authorities on your behalf."
              onClick={(e) => {setPoaModalOpen(true)}}
            />
            <GetStartedCard
              title="Submit your info for review"
              status="notStarted"
              text="When you’re done with the other steps, submit your info to
                Avalara’s compliance team to review before your first filing."
              onClick={(e) => {}}
            />
            <PoaModal open={poaModalOpen} setOpenState={setPoaModalOpen} />
          </Flex>
        </Layout>
      </Content>
    </>
  );
};

export default GetStarted;
