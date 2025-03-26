import { PropTypes } from 'prop-types';
import { Badge } from 'antd';

function getPrettyStatus(filingStatus) {
  let badgeStatus, statusString;
  const status = filingStatus ? filingStatus.toUpperCase() : '';

  switch (status) {
    case 'DIRTY':
      statusString = 'Refreshing numbers';
      badgeStatus = 'processing';
      break;
    case 'PENDINGAPPROVAL':
    case 'READYFORREVIEW':
      statusString = 'Ready for review';
      badgeStatus = 'processing';
      break;
    case 'APPROVEDTOFILE':
    case 'PENDINGFILING':
    case 'PENDINGFILINGONBEHALF':
    case 'RETURNACCEPTED':
    case 'RETURNACCEPTEDONBEHALF':
    case 'PAYMENTREMITTED':
    case 'PENDINGRETURN':
    case 'PENDINGRETURNOBEHALF':
    case 'RETURNREJECTED':
    case 'RETURNREJECTEDONBEHALF':
    case 'APPROVEDTOFILEONBEHALF':
    case 'PREPARINGTOFILE':
      statusString = 'Preparing to file';
      badgeStatus = 'success';
      break;
    case 'FILEDONBEHALF':
    case 'FILED':
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
