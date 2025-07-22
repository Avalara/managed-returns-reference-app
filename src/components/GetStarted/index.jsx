import React, { useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Layout,
  Row,
  Statistic,
  Tag,
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
import {
  DEFAULT_COUNTRY,
  FILING_REQUEST_STATUS,
  FUNDING_POA_STATUS,
  FILING_STATUS,
} from '../shared/Constants.js';

// Status constants
const TASK_STATUS = {
  NOT_STARTED: 'notStarted',
  IN_PROGRESS: 'inProgress',
  COMPLETE: 'complete',
  PENDING: 'pending',
  LOADING: 'loading',
  ERROR: 'error',
};

const { Title } = Typography;
const { Content } = Layout;

const cardStatus = {
  setUpReturns: {
    notStarted: <Tag color="default">Not started</Tag>,
    inProgress: <Tag color="orange">In progress</Tag>,
    complete: <Tag color="green">Completed</Tag>,
  },
  fundingPoa: {
    notStarted: <Tag color="default">Not started</Tag>,
    pending: <Tag color="orange">Pending</Tag>,
    complete: <Tag color="green">Completed</Tag>,
  },
  submitForReview: {
    notStarted: <Tag color="default">Not started</Tag>,
    complete: <Tag color="green">Completed</Tag>,
  },
};

const SetUpReturnsDescription = (
  status,
  { completedRegions, totalRegions },
  refetch
) => {
  switch (status) {
    case 'notStarted':
      return "You haven't set up any returns.";
    case 'inProgress':
      return `You've set up returns in ${completedRegions} of ${totalRegions} regions where you report tax.`;
    case 'complete':
      return 'You finished setting up returns.';
    case 'error':
      return (
        <Alert
          message="Error loading returns status"
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={refetch}>
              Retry
            </Button>
          }
        />
      );
    default:
      return '';
  }
};

const FundingPoaDescription = (status, refetch) => {
  switch (status) {
    case 'notStarted':
      return 'This is required so that Avalara can make tax payments to tax authorities on your behalf.';
    case 'pending':
      return 'An email has been sent to an authorized signee to complete the form.';
    case 'complete':
      return 'A signed document has been submitted.';
    case 'error':
      return (
        <Alert
          message="Error loading funding power of attorney status"
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={refetch}>
              Retry
            </Button>
          }
        />
      );
  }
};

const SubmitForReviewDescription = (status, refetch) => {
  switch (status) {
    case 'notStarted':
      return "When you're done with the other steps, submit your info to Avalara's compliance team to review before your first filing.";
    case 'complete':
      return 'Your info will be reviewed before your first filing period. If there are any issues, the compliance team will reach out to you.';
    case 'error':
      return (
        <Alert
          message="Error loading submit for review status"
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={refetch}>
              Retry
            </Button>
          }
        />
      );
  }
};

const SetUpReturnsActions = (status) => {
  const navigate = useNavigate();
  switch (status) {
    case 'notStarted':
      return [
        <Button
          key="start"
          type="primary"
          onClick={() => navigate('/returns/set-up-returns')}
        >
          Start
        </Button>,
      ];
    case 'inProgress':
      return [
        <Button
          key="continue"
          type="primary"
          onClick={() => navigate('/returns/existing-returns')}
        >
          Continue
        </Button>,
      ];
    case 'complete':
      return [
        <Button
          key="more-details"
          type="primary"
          onClick={() => navigate('/returns/existing-returns')}
        >
          More details
        </Button>,
      ];
    default:
      return null;
  }
};

const FundingPoaActions = (status) => {
  const navigate = useNavigate();
  switch (status) {
    case 'notStarted':
      return [
        <Button
          key="start"
          type="primary"
          onClick={() => navigate('/returns/create-funding')}
        >
          Start
        </Button>,
      ];
    case 'pending':
      return [
        <Button
          key="more-details"
          type="primary"
          onClick={() => navigate('/returns/funding')}
        >
          More details
        </Button>,
      ];
    case 'complete':
      return [
        <Button
          key="more-details"
          type="primary"
          onClick={() => navigate('/returns/funding')}
        >
          More details
        </Button>,
      ];
    default:
      return null;
  }
};

const SubmitForReviewActions = (
  status,
  isDisabled = false,
  isLoading = false,
  handleSubmitForReview
) => {
  switch (status) {
    case 'notStarted':
      return [
        <Button
          key="start"
          type="primary"
          onClick={handleSubmitForReview}
          {...(isDisabled ? { disabled: true } : {})}
          loading={isLoading}
        >
          Start
        </Button>,
      ];
    case 'complete':
      return [
        <Button key="start" type="primary" disabled={true}>
          Start
        </Button>,
      ];
    default:
      return null;
  }
};

const GetStartedCard = ({
  title,
  description,
  statusTag,
  actionButtons,
  loading = false,
}) => (
  <Card
    loading={loading}
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
    actions={actionButtons}
  >
    <p>{description}</p>
  </Card>
);

GetStartedCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  statusTag: PropTypes.node,
  actionButtons: PropTypes.array,
  loading: PropTypes.bool,
};

const GetStarted = () => {
  const { isLoggedIn, companyId } = useOutletContext();

  const [
    getFundingStatus,
    {
      loading: isLoadingFundingPOAStatus,
      error: didErrorFundingPOAStatus,
      data: dataFundingPOAStatus,
      refetch: refetchFundingStatus,
    },
  ] = useLazyQuery(FUNDING_STATUS);

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

  const [
    getFilingStatus,
    {
      loading: isLoadingFilingStatus,
      error: didErrorFilingStatus,
      data: dataFilingStatus,
      refetch: refetchFilingStatus,
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
        refetchFilingStatus();
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
    if (isLoadingFundingPOAStatus) {
      return TASK_STATUS.LOADING;
    }
    if (didErrorFundingPOAStatus) {
      return TASK_STATUS.ERROR;
    }

    const fundingStatusSet = new Set();
    dataFundingPOAStatus?.companies?.value?.[0]?.fundingStatus?.forEach(
      (item) => {
        if (item?.status) {
          fundingStatusSet.add(item.status);
        }
      }
    );

    if (fundingStatusSet.has(FUNDING_POA_STATUS.SIGNED)) {
      return TASK_STATUS.COMPLETE;
    } else if (fundingStatusSet.has(FUNDING_POA_STATUS.OUT_FOR_SIGNATURE)) {
      return TASK_STATUS.PENDING;
    } else {
      return TASK_STATUS.NOT_STARTED;
    }
  }, [
    dataFundingPOAStatus,
    isLoadingFundingPOAStatus,
    didErrorFundingPOAStatus,
  ]);

  const submitReviewStatus = useMemo(() => {
    if (isLoadingFilingStatus) {
      return TASK_STATUS.LOADING;
    }
    if (didErrorFilingStatus) {
      return TASK_STATUS.ERROR;
    }

    const filingStatus = dataFilingStatus?.companies?.value?.[0]?.filingStatus;

    if (
      filingStatus === FILING_STATUS.FIRST_FILING ||
      filingStatus === FILING_STATUS.ACTIVE ||
      filingStatus === FILING_STATUS.FILING_REQUESTED
    ) {
      return TASK_STATUS.COMPLETE;
    } else {
      return TASK_STATUS.NOT_STARTED;
    }
  }, [dataFilingStatus, isLoadingFilingStatus, didErrorFilingStatus]);

  const { setUpReturnsStatus, setUpReturnsCounts } = useMemo(() => {
    // loading status
    if (isLoadingSuggestedReturns || isLoadingFilingCalendarRequests) {
      return {
        setUpReturnsStatus: TASK_STATUS.LOADING,
        setUpReturnsCounts: { completedRegions: 0, totalRegions: 0 },
      };
    }

    // error status
    if (didErrorSuggestedReturns || didErrorFilingCalendarRequests) {
      return {
        setUpReturnsStatus: TASK_STATUS.ERROR,
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
          request.filingRequestStatusId === FILING_REQUEST_STATUS.APPROVED ||
          request.filingRequestStatusId === FILING_REQUEST_STATUS.CHANGE_REQUEST
      )
      .map((request) => request.data?.taxFormCode);

    // Calculate status based on business logic
    let calculatedStatus;
    if (
      suggestedTaxFormCodes.length === 0 &&
      existingTaxFormCodes.length === 0
    ) {
      calculatedStatus = TASK_STATUS.NOT_STARTED;
    } else if (suggestedTaxFormCodes.length === 0) {
      calculatedStatus = TASK_STATUS.COMPLETE;
    } else {
      // Check if all suggested forms are covered by existing filings
      const allSuggestedCovered = suggestedTaxFormCodes.every((suggestedCode) =>
        existingTaxFormCodes.includes(suggestedCode)
      );

      if (allSuggestedCovered) {
        calculatedStatus = TASK_STATUS.COMPLETE;
      } else {
        calculatedStatus = TASK_STATUS.IN_PROGRESS;
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
    Object.entries(suggestedByRegion).forEach(([_region, regionTaxForms]) => {
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
                    ].filter((status) => status === TASK_STATUS.COMPLETE).length
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
              description={SetUpReturnsDescription(
                setUpReturnsStatus,
                setUpReturnsCounts,
                refetchSuggestedReturns
              )}
              statusTag={cardStatus.setUpReturns[setUpReturnsStatus]}
              actionButtons={SetUpReturnsActions(setUpReturnsStatus)}
              loading={setUpReturnsStatus === TASK_STATUS.LOADING}
            />
            <GetStartedCard
              title="Sign funding power of attorney"
              description={FundingPoaDescription(
                fundingPOAStatus,
                refetchFundingStatus
              )}
              statusTag={cardStatus.fundingPoa[fundingPOAStatus]}
              actionButtons={FundingPoaActions(fundingPOAStatus)}
              loading={fundingPOAStatus === TASK_STATUS.LOADING}
            />
            <GetStartedCard
              title="Submit your info for review"
              description={SubmitForReviewDescription(
                submitReviewStatus,
                refetchFilingStatus
              )}
              statusTag={cardStatus.submitForReview[submitReviewStatus]}
              actionButtons={SubmitForReviewActions(
                submitReviewStatus,
                setUpReturnsStatus === TASK_STATUS.NOT_STARTED ||
                  fundingPOAStatus === TASK_STATUS.NOT_STARTED ||
                  setUpReturnsStatus === TASK_STATUS.LOADING ||
                  fundingPOAStatus === TASK_STATUS.LOADING ||
                  setUpReturnsStatus === TASK_STATUS.ERROR ||
                  fundingPOAStatus === TASK_STATUS.ERROR ||
                  submitReviewStatus === TASK_STATUS.LOADING ||
                  submitReviewStatus === TASK_STATUS.ERROR,
                isSubmittingSubmitReview,
                handleSubmitForReview
              )}
              loading={submitReviewStatus === TASK_STATUS.LOADING}
            />
          </Flex>
        </Layout>
      </Content>
    </>
  );
};

export default GetStarted;
