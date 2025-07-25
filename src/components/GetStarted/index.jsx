import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import { Col, Flex, Layout, Row, Statistic, Typography } from 'antd';

import {
  fundingStatus as FUNDING_STATUS,
  filingCalendarRequests as FILING_CALENDAR_REQUESTS,
  companyFilingStatus as COMPANY_FILING_STATUS,
  companySuggestedReturns as SUGGESTED_RETURNS,
} from '../../graphql/queries';
import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { PageHeader } from '../shared';
import {
  DEFAULT_COUNTRY,
  GET_STARTED_TASK_STATUS,
} from '../shared/Constants.js';

import {
  useFundingPoaStatus,
  useSubmitReviewStatus,
  useSetUpReturnsStatus,
} from './hooks';

import {
  SetUpReturnsCard,
  FundingPoaCard,
  SubmitReviewCard,
} from './components';

const { Title } = Typography;
const { Content } = Layout;

const GetStarted = () => {
  const { isLoggedIn, companyId } = useOutletContext();

  // API calls for the set up returns card
  const [
    getSuggestedReturns,
    {
      loading: isLoadingSuggestedReturns,
      error: didErrorSuggestedReturns,
      data: dataSuggestedReturns,
      refetch: refetchSuggestedReturns,
    },
  ] = useLazyQuery(SUGGESTED_RETURNS);

  const [
    getFilingCalendarRequests,
    {
      loading: isLoadingFilingCalendarRequests,
      error: didErrorFilingCalendarRequests,
      data: dataFilingCalendarRequests,
      refetch: refetchFilingCalendarRequests,
    },
  ] = useLazyQuery(FILING_CALENDAR_REQUESTS);

  // API calls for the power of attorney card
  const [
    getFundingStatus,
    {
      loading: isLoadingFundingPOAStatus,
      error: didErrorFundingPOAStatus,
      data: dataFundingPOAStatus,
      refetch: refetchFundingStatus,
    },
  ] = useLazyQuery(FUNDING_STATUS);

  // API calls for submit for review card
  const [
    getFilingStatus,
    {
      loading: isLoadingFilingStatus,
      error: didErrorFilingStatus,
      data: dataFilingStatus,
      refetch: refetchFilingStatus,
    },
  ] = useLazyQuery(COMPANY_FILING_STATUS);

  // Use custom hooks for status calculations
  const fundingPOAStatus = useFundingPoaStatus(
    isLoadingFundingPOAStatus,
    didErrorFundingPOAStatus,
    dataFundingPOAStatus
  );

  const submitReviewStatus = useSubmitReviewStatus(
    isLoadingFilingStatus,
    didErrorFilingStatus,
    dataFilingStatus
  );

  const { setUpReturnsStatus, setUpReturnsCounts } = useSetUpReturnsStatus(
    isLoadingSuggestedReturns,
    didErrorSuggestedReturns,
    dataSuggestedReturns,
    isLoadingFilingCalendarRequests,
    didErrorFilingCalendarRequests,
    dataFilingCalendarRequests
  );

  useEffect(() => {
    if (isLoggedIn && companyId) {
      getFundingStatus({ variables: { companyId: parseInt(companyId) } });
      getFilingStatus({ variables: { companyId: parseInt(companyId) } });
      getSuggestedReturns({
        variables: {
          companyId: parseInt(companyId),
          country: DEFAULT_COUNTRY,
        },
      });
      getFilingCalendarRequests({
        variables: { companyId: parseInt(companyId) },
      });
    }
  }, [
    isLoggedIn,
    companyId,
    getFundingStatus,
    getFilingStatus,
    getSuggestedReturns,
    getFilingCalendarRequests,
  ]);

  const completedTasksCount = [
    setUpReturnsStatus,
    fundingPOAStatus,
    submitReviewStatus,
  ].filter((status) => status === GET_STARTED_TASK_STATUS.COMPLETE).length;

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
                sign the funding power of attorney. When you&apos;re ready,
                Avalara&apos;s compliance team will review all your information
                before your first filing period.
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
                  value={completedTasksCount}
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
            <SetUpReturnsCard
              setUpReturnsStatus={setUpReturnsStatus}
              setUpReturnsCounts={setUpReturnsCounts}
              refetchSetUpReturnsStatus={() => {
                refetchSuggestedReturns();
                refetchFilingCalendarRequests();
              }}
            />
            <FundingPoaCard
              fundingPOAStatus={fundingPOAStatus}
              refetchFundingStatus={refetchFundingStatus}
            />
            <SubmitReviewCard
              submitReviewStatus={submitReviewStatus}
              refetchFilingStatus={refetchFilingStatus}
              setUpReturnsStatus={setUpReturnsStatus}
              fundingPOAStatus={fundingPOAStatus}
              companyId={companyId}
            />
          </Flex>
        </Layout>
      </Content>
    </>
  );
};

export default GetStarted;
