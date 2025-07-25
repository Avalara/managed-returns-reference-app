import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Tag } from 'antd';
import GetStartedCard from './GetStartedCard';
import { GET_STARTED_TASK_STATUS } from '../../shared/Constants.js';

const cardStatus = {
  [GET_STARTED_TASK_STATUS.NOT_STARTED]: <Tag color="default">Not started</Tag>,
  [GET_STARTED_TASK_STATUS.IN_PROGRESS]: <Tag color="orange">In progress</Tag>,
  [GET_STARTED_TASK_STATUS.COMPLETE]: <Tag color="green">Completed</Tag>,
};

const SetUpReturnsDescription = (
  status,
  { returnsSetUpInRegionsCount, totalRegionsCount },
  refetch
) => {
  switch (status) {
    case GET_STARTED_TASK_STATUS.NOT_STARTED:
      return "You haven't set up any returns.";
    case GET_STARTED_TASK_STATUS.IN_PROGRESS:
      return `You've set up returns in ${returnsSetUpInRegionsCount} of ${totalRegionsCount} regions where you report tax.`;
    case GET_STARTED_TASK_STATUS.COMPLETE:
      return 'You finished setting up returns.';
    case GET_STARTED_TASK_STATUS.ERROR:
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

const SetUpReturnsActions = (status) => {
  const navigate = useNavigate();
  switch (status) {
    case GET_STARTED_TASK_STATUS.NOT_STARTED:
      return [
        <Button
          key="start"
          type="primary"
          onClick={() => navigate('/returns/set-up-returns')}
        >
          Start
        </Button>,
      ];
    case GET_STARTED_TASK_STATUS.IN_PROGRESS:
      return [
        <Button
          key="continue"
          type="primary"
          onClick={() => navigate('/returns/existing-returns')}
        >
          Continue
        </Button>,
      ];
    case GET_STARTED_TASK_STATUS.COMPLETE:
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

const SetUpReturnsCard = ({
  setUpReturnsStatus,
  setUpReturnsCounts,
  refetchSetUpReturnsStatus,
}) => (
  <GetStartedCard
    title="Set up returns"
    description={SetUpReturnsDescription(
      setUpReturnsStatus,
      setUpReturnsCounts,
      refetchSetUpReturnsStatus
    )}
    statusTag={cardStatus[setUpReturnsStatus]}
    actionButtons={SetUpReturnsActions(setUpReturnsStatus)}
    loading={setUpReturnsStatus === GET_STARTED_TASK_STATUS.LOADING}
  />
);

export default SetUpReturnsCard;

SetUpReturnsCard.propTypes = {
  setUpReturnsStatus: PropTypes.oneOf(Object.values(GET_STARTED_TASK_STATUS))
    .isRequired,
  setUpReturnsCounts: PropTypes.shape({
    returnsSetUpInRegionsCount: PropTypes.number.isRequired,
    totalRegionsCount: PropTypes.number.isRequired,
  }).isRequired,
  refetchSetUpReturnsStatus: PropTypes.func.isRequired,
};
