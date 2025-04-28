import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import {
  Button,
  Card,
  Col,
  Flex,
  Layout,
  Row,
  Statistic,
  Tag,
  theme,
  Typography,
} from 'antd';

import { fundingStatus as FUNDING_STATUS } from '../../graphql/queries';
import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { PageHeader } from '../shared';

const { Title } = Typography;
const { Content } = Layout;

const cardTextByActionStatus = {
  setUpReturns: {
    notStarted: 'You haven’t set up any returns.',
    pending: 'You’ve set up returns in 5 of 10 states where you report tax.',
    complete: 'You finished setting up returns.',
  },
  fundingPoa: {
    notStarted:
      'This is required so that Avalara can make tax payments to tax authorities on your behalf.',
    pending:
      'An email has been sent to an authorized signee to complete the form.',
    complete: 'A signed document has been submitted.',
  },
  submitForReview: {
    notStarted:
      'When you’re done with the other steps, submit your info to Avalara’s compliance team to review before your first filing.',
    pending:
      'When you’re done with the other steps, submit your info to Avalara’s compliance team to review before your first filing.',
    complete:
      'Your info will be reviewed before your first filing period. If there are any issues, the compliance team will reach out to you.',
  },
};

const GetStartedCard = ({ title, status, text, onClick, loading = false }) => {
  const statusTag = (() => {
    switch (status) {
      case 'loading':
        return '';
      case 'complete':
        return <Tag color="green">Complete</Tag>;
      case 'pending':
        return <Tag color="orange">Pending</Tag>;
      case 'inProgress':
        return <Tag color="orange">In progress</Tag>;
      case 'notStarted':
      default:
        return <Tag color="default">Not started</Tag>;
    }
  })();

  return (
    <Card
      loading={status === 'loading'}
      title={title}
      extra={statusTag}
      style={{
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
          disabled={status !== 'notStarted' || loading}
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
  const { isLoggedIn, companyId } = useOutletContext();

  const [poaStatus, setPoaStatus] = useState('loading');

  const [getFundingStatus, fundingStatusResponse] =
    useLazyQuery(FUNDING_STATUS);

  useEffect(() => {
    if (isLoggedIn && companyId) {
      getFundingStatus({ variables: { companyId: parseInt(companyId) } });
    }
  }, [isLoggedIn, companyId]);

  useEffect(() => {
    const { loading, error, data } = fundingStatusResponse;
    if (!error && !loading && data) {
      const fundingStatusSet = new Set();
      data?.companies?.value?.[0]?.fundingStatus?.forEach((item) => {
        if (item?.status) {
          fundingStatusSet.add(item.status);
        }
      });

      if (fundingStatusSet.has('Signed')) {
        setPoaStatus('complete');
      } else if (fundingStatusSet.has('Out for Signature')) {
        setPoaStatus('pending');
      } else {
        setPoaStatus('notStarted');
      }
    }
  }, [fundingStatusResponse]);
  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Row align="bottom">
            <Col span={24} lg={16}>
              <Title level={1}>Get started</Title>
              <p>
                Set up all the returns that you want Avalara to file for you and
                sign the funding power of attorney. When you’re ready, Avalara’s
                compliance team will review all your information before your
                first filing period.
              </p>
            </Col>
            <Col span={24} lg={8}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  textAlign: 'right',
                }}
              >
                <Statistic
                  title="Progress"
                  value={0}
                  suffix="/ 3 tasks complete"
                />
              </div>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          <Flex wrap="wrap" gap="middle" justify="flex-start">
            <GetStartedCard
              title="Set up returns"
              status="notStarted"
              text={cardTextByActionStatus.setUpReturns.notStarted}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/returns/set-up-returns';
              }}
            />
            <GetStartedCard
              title="Sign funding power of attorney"
              status={poaStatus}
              text={cardTextByActionStatus.fundingPoa[poaStatus]}
              onClick={(e) => {
                window.location.href = '/returns/funding';
              }}
            />
            <GetStartedCard
              title="Submit your info for review"
              status="notStarted"
              text={cardTextByActionStatus.submitForReview.notStarted}
              onClick={(e) => {}}
            />
          </Flex>
        </Layout>
      </Content>
    </>
  );
};

export default GetStarted;
