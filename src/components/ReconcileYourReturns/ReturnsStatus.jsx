import { PropTypes } from 'prop-types';
import { Badge } from 'antd';

export const NEXUS_TYPE_ID_SALES_TAX = 'SALES_TAX';
export const BUILDING_STATUS = 'Building';
export const READY_TO_FILE_STATUS = 'Ready to file';
export const APPROVED_BY_AVALARA_STATUS = 'Approved by Avalara';
export const DO_NOT_FILE_STATUS = 'Do not file';
export const FILING_STATUS = 'Filing';
export const FILED_STATUS = 'Filed';
export const PAST_DEADLINE_STATUS = 'Past Deadline';
export const ACCRUING_STATUS = 'Accruing';
export const VOIDED_STATUS = 'Voided';
export const REJECTED_STATUS = 'Rejected';
export const SELF_FILED_STATUS = 'Self-filed';
export const FILED_BY_CUSTOMER_STATUS = 'Filed By Customer';

function getPrettyStatus(filingStatus) {
  return filingStatus;
}

// function getPrettyStatus(filingStatus) {
//   let badgeStatus, statusString;
//   switch (filingStatus) {
//     case 'Dirty':
//       statusString = BUILDING_STATUS;
//       badgeStatus = 'processing';
//       break;
//     case 'PendingApproval':
//       statusString = READY_TO_FILE_STATUS;
//       badgeStatus = 'success';
//       break;
//     case 'ApprovedToFileOnBehalf':
//       statusString = APPROVED_BY_AVALARA_STATUS;
//       badgeStatus = 'success';

//       break;
//     case 'ApprovedToFile':
//     case 'PendingFiling':
//     case 'PendingFilingOnBehalf':
//     case 'PendingReturn':
//     case 'PendingReturnOnBehalf':
//     case 'PaymentRemitted':
//     case 'ReturnRejected':
//     case 'ReturnRejectedOnBehalf':
//       statusString = FILING_STATUS;
//       badgeStatus = 'success';

//       break;
//     case 'Filed':
//     case 'FiledOnBehalf':
//     case 'ReturnAccepted':
//     case 'ReturnAcceptedOnBehalf':
//       statusString = FILED_STATUS;
//       badgeStatus = 'success';

//       break;
//     case 'DoNotFile':
//       statusString = DO_NOT_FILE_STATUS;
//       badgeStatus = 'warning';

//       break;
//     case 'FiledByCustomer':
//       statusString = FILED_BY_CUSTOMER_STATUS;
//       badgeStatus = 'success';

//       break;
//     default:
//       statusString = filingStatus;
//       badgeStatus = 'default';
//   }

//   return [statusString, badgeStatus];
// }

const ReturnsStatus = ({ filingStatus }) => {
  if (!filingStatus) return null;

  const [statusString, badgeStatus] = getPrettyStatus(filingStatus);

  return <Badge status={badgeStatus} text={statusString} />;
};

ReturnsStatus.propTypes = {
  filingStatus: PropTypes.string,
};

export default ReturnsStatus;
