import { useMemo } from 'react';
import {
  FUNDING_POA_STATUS,
  GET_STARTED_TASK_STATUS,
} from '../../shared/Constants.js';

export const useFundingPoaStatus = (
  isLoadingFundingPOAStatus,
  didErrorFundingPOAStatus,
  dataFundingPOAStatus
) =>
  useMemo(() => {
    if (isLoadingFundingPOAStatus) {
      return GET_STARTED_TASK_STATUS.LOADING;
    }
    if (didErrorFundingPOAStatus) {
      return GET_STARTED_TASK_STATUS.ERROR;
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
      return GET_STARTED_TASK_STATUS.COMPLETE;
    } else if (fundingStatusSet.has(FUNDING_POA_STATUS.OUT_FOR_SIGNATURE)) {
      return GET_STARTED_TASK_STATUS.PENDING;
    } else {
      return GET_STARTED_TASK_STATUS.NOT_STARTED;
    }
  }, [
    dataFundingPOAStatus,
    isLoadingFundingPOAStatus,
    didErrorFundingPOAStatus,
  ]);
