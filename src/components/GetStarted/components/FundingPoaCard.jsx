import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Tag } from 'antd';
import GetStartedCard from './GetStartedCard';
import { GET_STARTED_TASK_STATUS } from '../../shared/Constants.js';

const cardStatus = {
  [GET_STARTED_TASK_STATUS.NOT_STARTED]: <Tag color="default">Not started</Tag>,
  [GET_STARTED_TASK_STATUS.PENDING]: <Tag color="orange">Pending</Tag>,
  [GET_STARTED_TASK_STATUS.COMPLETE]: <Tag color="green">Completed</Tag>,
};

const FundingPoaDescription = (status, refetch) => {
  switch (status) {
    case GET_STARTED_TASK_STATUS.NOT_STARTED:
      return 'This is required so that Avalara can make tax payments to tax authorities on your behalf.';
    case GET_STARTED_TASK_STATUS.PENDING:
      return 'An email has been sent to an authorized signee to complete the form.';
    case GET_STARTED_TASK_STATUS.COMPLETE:
      return 'A signed document has been submitted.';
    case GET_STARTED_TASK_STATUS.ERROR:
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
    default:
      return '';
  }
};

const FundingPoaActions = (status) => {
  const navigate = useNavigate();
  switch (status) {
    case GET_STARTED_TASK_STATUS.NOT_STARTED:
      return [
        <Button
          key="start"
          type="primary"
          onClick={() => navigate('/returns/create-funding')}
        >
          Start
        </Button>,
      ];
    case GET_STARTED_TASK_STATUS.PENDING:
      return [
        <Button
          key="more-details"
          type="primary"
          onClick={() => navigate('/returns/funding')}
        >
          More details
        </Button>,
      ];
    case GET_STARTED_TASK_STATUS.COMPLETE:
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

const FundingPoaCard = ({ fundingPOAStatus, refetchFundingStatus }) => (
  <GetStartedCard
    title="Sign funding power of attorney"
    description={FundingPoaDescription(fundingPOAStatus, refetchFundingStatus)}
    statusTag={cardStatus[fundingPOAStatus]}
    actionButtons={FundingPoaActions(fundingPOAStatus)}
    loading={fundingPOAStatus === GET_STARTED_TASK_STATUS.LOADING}
  />
);

FundingPoaCard.propTypes = {
  fundingPOAStatus: PropTypes.oneOf(Object.values(GET_STARTED_TASK_STATUS))
    .isRequired,
  refetchFundingStatus: PropTypes.func.isRequired,
};

export default FundingPoaCard;
