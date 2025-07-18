import React, { useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';

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
  notification,
} from 'antd';

import {
  fundingStatus as FUNDING_STATUS,
  filingCalendarRequests as FILING_CALENDAR_REQUESTS,
  companyFilingStatus as COMPANY_FILING_STATUS,
  companySuggestedReturns as SUGGESTED_RETURNS,
} from '../../graphql/queries';
import { reviewFilingRequests } from '../../graphql/mutations';
import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { PageHeader } from '../shared';
import { DEFAULT_COUNTRY } from '../shared/Constants.js';

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
        return <Tag color="green">Completed</Tag>;
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
          type="primary"
          disabled={!['notStarted', 'pending'].includes(status)}
          loading={loading && ['notStarted', 'pending'].includes(status)}
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
  const { isLoggedIn, companyId } = useOutletContext();
  const navigate = useNavigate();

  const [
    getFundingStatus,
    {
      loading: isLoadingFundingPOAStatus,
      error: didErrorFundingPOAStatus,
      data: dataFundingPOAStatus,
    },
  ] = useLazyQuery(FUNDING_STATUS);

  const [
    getSuggestedReturns,
    {
      loading: isLoadingSuggestedReturns,
      error: didErrorSuggestedReturns,
      data: dataSuggestedReturns,
    },
  ] = useLazyQuery(SUGGESTED_RETURNS);

  const [
    getFilingCalendarRequests,
    {
      loading: isLoadingFilingCalendarRequests,
      error: didErrorFilingCalendarRequests,
      data: dataFilingCalendarRequests,
    },
  ] = useLazyQuery(FILING_CALENDAR_REQUESTS);

  const [
    getFilingStatus,
    {
      loading: isLoadingFilingStatus,
      error: didErrorFilingStatus,
      data: dataFilingStatus,
    },
  ] = useLazyQuery(COMPANY_FILING_STATUS);

  const [submitReviewMutation, { loading: isSubmittingSubmitReview }] =
    useMutation(reviewFilingRequests, {
      onCompleted: () => {
        notification.success({
          message: 'Review submission successful',
          description: (
            <span>
              Your information has been <strong>successfully submitted</strong>{' '}
              for review by Avalara&apos;s compliance team.
            </span>
          ),
          placement: 'topRight',
          duration: 10,
        });
        // Refetch the filing status to update the UI
        getFilingStatus({ variables: { companyId: parseInt(companyId) } });
      },
      onError: (error) => {
        notification.error({
          message: 'Review submission failed',
          description: (
            <span>
              Failed to submit your information for review.{' '}
              <strong>Please try again.</strong>
            </span>
          ),
          placement: 'topRight',
          duration: 10,
        });
        console.error('Error submitting for review:', error);
      },
    });

  const handleSubmitForReview = () => {
    submitReviewMutation({
      variables: { companyId: parseInt(companyId) },
    });
  };

  // Memoized status calculations
  const fundingPOAStatus = useMemo(() => {
    if (
      !dataFundingPOAStatus ||
      isLoadingFundingPOAStatus ||
      didErrorFundingPOAStatus
    ) {
      return 'loading';
    }

    const fundingStatusSet = new Set();
    dataFundingPOAStatus?.companies?.value?.[0]?.fundingStatus?.forEach(
      (item) => {
        if (item?.status) {
          fundingStatusSet.add(item.status);
        }
      }
    );

    if (fundingStatusSet.has('Signed')) {
      return 'complete';
    } else if (fundingStatusSet.has('Out for Signature')) {
      return 'pending';
    } else {
      return 'notStarted';
    }
  }, [
    dataFundingPOAStatus,
    isLoadingFundingPOAStatus,
    didErrorFundingPOAStatus,
  ]);

  const submitReviewStatus = useMemo(() => {
    if (!dataFilingStatus || isLoadingFilingStatus || didErrorFilingStatus) {
      return 'loading';
    }

    const filingStatus = dataFilingStatus?.companies?.value?.[0]?.filingStatus;

    if (filingStatus === 'NOTYETFILING') {
      return 'notStarted';
    } else {
      return 'complete';
    }
  }, [dataFilingStatus, isLoadingFilingStatus, didErrorFilingStatus]);

  const { setUpReturnsStatus, setUpReturnsCounts } = useMemo(() => {
    if (
      isLoadingSuggestedReturns ||
      isLoadingFilingCalendarRequests ||
      didErrorSuggestedReturns ||
      didErrorFilingCalendarRequests ||
      !dataSuggestedReturns ||
      !dataFilingCalendarRequests
    ) {
      return {
        setUpReturnsStatus: 'loading',
        setUpReturnsCounts: { completedRegions: 0, totalRegions: 0 },
      };
    }

    // Get suggested returns tax form codes with regions
    const suggestedTaxForms =
      dataSuggestedReturns?.companies?.value?.[0]?.suggestedTaxForms || [];

    // Extract all tax form codes for overall status calculation
    const allSuggestedTaxFormCodes = [];
    suggestedTaxForms.forEach((taxFormGroup) => {
      const returns = taxFormGroup.suggestedReturns || [];
      returns.forEach((suggestedReturn) => {
        allSuggestedTaxFormCodes.push(suggestedReturn.taxFormCode);
      });
    });

    const suggestedTaxFormCodes = allSuggestedTaxFormCodes;

    // Get filing calendar requests and calendars tax form codes
    const filingRequests =
      dataFilingCalendarRequests?.filingCalendarRequests?.value?.filingRequests
        ?.value || [];

    // filter for approved and change requests
    const existingTaxFormCodes = filingRequests
      .filter(
        (request) =>
          request.filingRequestStatusId === 'REQUESTAPPROVED' ||
          request.filingRequestStatusId === 'CHANGEREQUEST'
      )
      .map((request) => request.data?.taxFormCode);

    // Calculate status based on business logic
    let calculatedStatus;
    if (
      suggestedTaxFormCodes.length === 0 &&
      existingTaxFormCodes.length === 0
    ) {
      calculatedStatus = 'notStarted';
    } else if (suggestedTaxFormCodes.length === 0) {
      calculatedStatus = 'complete';
    } else {
      // Check if all suggested forms are covered by existing filings
      const allSuggestedCovered = suggestedTaxFormCodes.every((suggestedCode) =>
        existingTaxFormCodes.includes(suggestedCode)
      );

      if (allSuggestedCovered) {
        calculatedStatus = 'complete';
      } else {
        calculatedStatus = 'pending';
      }
    }

    // Group suggested tax forms by region using API region field
    const suggestedByRegion = {};

    suggestedTaxForms.forEach((taxFormGroup) => {
      const region = taxFormGroup.region || 'UNKNOWN';
      const returns = taxFormGroup.suggestedReturns || [];

      if (!suggestedByRegion[region]) {
        suggestedByRegion[region] = [];
      }

      returns.forEach((suggestedReturn) => {
        suggestedByRegion[region].push(suggestedReturn.taxFormCode);
      });
    });

    const totalRegions = Object.keys(suggestedByRegion).length;

    // Check which regions are complete (all their suggested forms exist in existing codes)
    let completedRegions = 0;
    Object.entries(suggestedByRegion).forEach(([_, regionTaxForms]) => {
      const allFormsExist = regionTaxForms.every((taxForm) =>
        existingTaxFormCodes.includes(taxForm)
      );
      if (allFormsExist) {
        completedRegions++;
      }
    });

    return {
      setUpReturnsStatus: calculatedStatus,
      setUpReturnsCounts: { completedRegions, totalRegions },
    };
  }, [
    isLoadingSuggestedReturns,
    didErrorSuggestedReturns,
    dataSuggestedReturns,
    isLoadingFilingCalendarRequests,
    didErrorFilingCalendarRequests,
    dataFilingCalendarRequests,
  ]);

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

  // Generate dynamic text for Set Up Returns card
  const getSetUpReturnsText = (status) => {
    switch (status) {
      case 'notStarted':
        return "You haven't set up any returns.";
      case 'pending':
        return `You've set up returns in ${setUpReturnsCounts.completedRegions} of ${setUpReturnsCounts.totalRegions} regions where you report tax.`;
      case 'complete':
        return 'You finished setting up returns.';
      default:
        return '';
    }
  };

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
                  value={
                    [
                      setUpReturnsStatus,
                      fundingPOAStatus,
                      submitReviewStatus,
                    ].filter((status) => status === 'complete').length
                  }
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
              status={setUpReturnsStatus}
              text={getSetUpReturnsText(setUpReturnsStatus)}
              onClick={(e) => {
                e.preventDefault();
                navigate('/returns/set-up-returns');
              }}
            />
            <GetStartedCard
              title="Sign funding power of attorney"
              status={fundingPOAStatus}
              text={cardTextByActionStatus.fundingPoa[fundingPOAStatus]}
              onClick={(e) => {
                e.preventDefault();
                navigate('/returns/funding');
              }}
            />
            <GetStartedCard
              title="Submit your info for review"
              status={submitReviewStatus}
              text={
                cardTextByActionStatus.submitForReview[submitReviewStatus] || ''
              }
              onClick={handleSubmitForReview}
              loading={isSubmittingSubmitReview}
            />
          </Flex>
        </Layout>
      </Content>
    </>
  );
};

export default GetStarted;
