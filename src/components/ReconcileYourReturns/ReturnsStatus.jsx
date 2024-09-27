import { PropTypes } from 'prop-types';
import { Badge } from 'antd';

function getPrettyStatus(filingStatus) {
  let badgeStatus, statusString;
  switch (filingStatus) {
    case 'Dirty':
      statusString = 'Refreshing numbers';
      badgeStatus = 'processing';
      break;
    case 'PendingApproval':
      statusString = 'Ready for review';
      badgeStatus = 'processing';
      break;
    case 'ApprovedToFile':
    case 'PendingFiling':
    case 'PendingFilingOnBehalf':
    case 'ReturnAccepted':
    case 'ReturnAcceptedOnBehalf':
    case 'PaymentRemitted':
    case 'PendingReturn':
    case 'PendingReturnOnBehalf':
    case 'ReturnRejected':
    case 'ReturnRejectedOnBehalf':
    case 'ApprovedToFileOnBehalf':
      statusString = 'Preparing to file';
      badgeStatus = 'success';
      break;
    case 'FiledOnBehalf':
    case 'Filed':
      statusString = 'Filed';
      badgeStatus = 'success';
      break;
    default:
      statusString = filingStatus;
      badgeStatus = 'default';
  }

  return [statusString, badgeStatus];
}

const ReturnsStatus = ({ filingStatus }) => {
  if (!filingStatus) return null;

  const [statusString, badgeStatus] = getPrettyStatus(filingStatus);

  return <Badge status={badgeStatus} text={statusString} />;
};

ReturnsStatus.propTypes = {
  filingStatus: PropTypes.string,
};

export default ReturnsStatus;
