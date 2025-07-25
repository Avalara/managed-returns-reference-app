import { useMemo } from 'react';
import {
  FILING_STATUS,
  GET_STARTED_TASK_STATUS,
} from '../../shared/Constants.js';

export const useSubmitReviewStatus = (
  isLoadingFilingStatus,
  didErrorFilingStatus,
  dataFilingStatus
) =>
  useMemo(() => {
    if (isLoadingFilingStatus) {
      return GET_STARTED_TASK_STATUS.LOADING;
    }
    if (didErrorFilingStatus) {
      return GET_STARTED_TASK_STATUS.ERROR;
    }

    const filingStatus = dataFilingStatus?.companies?.value?.[0]?.filingStatus;

    if (
      filingStatus === FILING_STATUS.FIRST_FILING ||
      filingStatus === FILING_STATUS.ACTIVE ||
      filingStatus === FILING_STATUS.FILING_REQUESTED
    ) {
      return GET_STARTED_TASK_STATUS.COMPLETE;
    } else {
      return GET_STARTED_TASK_STATUS.NOT_STARTED;
    }
  }, [dataFilingStatus, isLoadingFilingStatus, didErrorFilingStatus]);
