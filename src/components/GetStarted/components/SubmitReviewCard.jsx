import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Alert, Button, Tag, notification } from 'antd';
import GetStartedCard from './GetStartedCard';
import { GET_STARTED_TASK_STATUS } from '../../shared/Constants.js';
import { reviewFilingRequests } from '../../../graphql/mutations';

const cardStatus = {
  [GET_STARTED_TASK_STATUS.NOT_STARTED]: <Tag color="default">Not started</Tag>,
  [GET_STARTED_TASK_STATUS.COMPLETE]: <Tag color="green">Completed</Tag>,
};

const SubmitForReviewDescription = (status, refetch) => {
  switch (status) {
    case GET_STARTED_TASK_STATUS.NOT_STARTED:
      return "When you're done with the other steps, submit your info to Avalara's compliance team to review before your first filing.";
    case GET_STARTED_TASK_STATUS.COMPLETE:
      return 'Your info will be reviewed before your first filing period. If there are any issues, the compliance team will reach out to you.';
    case GET_STARTED_TASK_STATUS.ERROR:
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
    default:
      return '';
  }
};

const SubmitForReviewActions = (
  status,
  isDisabled = false,
  isLoading = false,
  handleSubmitForReview
) => {
  switch (status) {
    case GET_STARTED_TASK_STATUS.NOT_STARTED:
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
    case GET_STARTED_TASK_STATUS.COMPLETE:
      return [
        <Button key="start" type="primary" disabled={true}>
          Start
        </Button>,
      ];
    default:
      return null;
  }
};

const SubmitReviewCard = ({
  submitReviewStatus,
  refetchFilingStatus,
  setUpReturnsStatus,
  fundingPOAStatus,
  companyId,
}) => {
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

  const isDisabled =
    setUpReturnsStatus === GET_STARTED_TASK_STATUS.NOT_STARTED ||
    fundingPOAStatus === GET_STARTED_TASK_STATUS.NOT_STARTED ||
    setUpReturnsStatus === GET_STARTED_TASK_STATUS.LOADING ||
    fundingPOAStatus === GET_STARTED_TASK_STATUS.LOADING ||
    setUpReturnsStatus === GET_STARTED_TASK_STATUS.ERROR ||
    fundingPOAStatus === GET_STARTED_TASK_STATUS.ERROR ||
    submitReviewStatus === GET_STARTED_TASK_STATUS.LOADING ||
    submitReviewStatus === GET_STARTED_TASK_STATUS.ERROR;

  return (
    <GetStartedCard
      title="Submit your info for review"
      description={SubmitForReviewDescription(
        submitReviewStatus,
        refetchFilingStatus
      )}
      statusTag={cardStatus[submitReviewStatus]}
      actionButtons={SubmitForReviewActions(
        submitReviewStatus,
        isDisabled,
        isSubmittingSubmitReview,
        handleSubmitForReview
      )}
      loading={submitReviewStatus === GET_STARTED_TASK_STATUS.LOADING}
    />
  );
};

export default SubmitReviewCard;

SubmitReviewCard.propTypes = {
  submitReviewStatus: PropTypes.oneOf(Object.values(GET_STARTED_TASK_STATUS))
    .isRequired,
  refetchFilingStatus: PropTypes.func.isRequired,
  setUpReturnsStatus: PropTypes.oneOf(Object.values(GET_STARTED_TASK_STATUS))
    .isRequired,
  fundingPOAStatus: PropTypes.oneOf(Object.values(GET_STARTED_TASK_STATUS))
    .isRequired,
  companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
