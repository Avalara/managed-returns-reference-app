import { useMemo } from 'react';
import {
  FILING_REQUEST_STATUS,
  GET_STARTED_TASK_STATUS,
} from '../../shared/Constants.js';

export const useSetUpReturnsStatus = (
  isLoadingSuggestedReturns,
  didErrorSuggestedReturns,
  dataSuggestedReturns,
  isLoadingFilingCalendarRequests,
  didErrorFilingCalendarRequests,
  dataFilingCalendarRequests
) =>
  useMemo(() => {
    // loading status
    if (isLoadingSuggestedReturns || isLoadingFilingCalendarRequests) {
      return {
        setUpReturnsStatus: GET_STARTED_TASK_STATUS.LOADING,
        setUpReturnsCounts: {
          returnsSetUpInRegionsCount: 0,
          totalRegionsCount: 0,
        },
      };
    }

    // error status
    if (didErrorSuggestedReturns || didErrorFilingCalendarRequests) {
      return {
        setUpReturnsStatus: GET_STARTED_TASK_STATUS.ERROR,
        setUpReturnsCounts: {
          returnsSetUpInRegionsCount: 0,
          totalRegionsCount: 0,
        },
      };
    }

    // Get suggested returns tax form codes with regions
    const suggestedTaxFormsByRegion =
      dataSuggestedReturns?.companies?.value?.[0]?.suggestedTaxForms || [];

    // Get filing calendar requests and calendars tax form codes
    const filingRequests =
      dataFilingCalendarRequests?.filingCalendarRequests?.value?.filingRequests
        ?.value || [];

    // Create Set for O(1) lookup performance - filter and create Set in one step
    const existingTaxFormCodes = new Set(
      filingRequests
        .filter(
          (request) =>
            request.filingRequestStatusId === FILING_REQUEST_STATUS.APPROVED ||
            request.filingRequestStatusId ===
              FILING_REQUEST_STATUS.CHANGE_REQUEST
        )
        .map((request) => request.data?.taxFormCode)
        .filter(Boolean)
    );

    // Process all regions in a single pass with direct counting
    const { totalRegionsCount, completed, inProgress } =
      suggestedTaxFormsByRegion.reduce(
        (acc, taxFormRegionGroup) => {
          const returns = taxFormRegionGroup.suggestedReturns || [];
          acc.totalRegionsCount++;

          if (returns.length === 0) {
            // Empty regions are considered complete
            acc.completed++;
            return acc;
          }

          // Count completed returns in a single pass
          const completedCount = returns.reduce(
            (count, taxForm) =>
              existingTaxFormCodes.has(taxForm.taxFormCode) ? count + 1 : count,
            0
          );

          if (completedCount === returns.length) {
            acc.completed++;
          } else if (completedCount > 0) {
            acc.inProgress++;
          }

          return acc;
        },
        {
          totalRegionsCount: 0,
          completed: 0,
          inProgress: 0,
        }
      );

    // Calculate returnsSetUpInRegionsCount as completed + inProgress
    const returnsSetUpInRegionsCount = completed + inProgress;

    // Calculate status with direct comparison
    const calculatedStatus =
      totalRegionsCount === 0
        ? GET_STARTED_TASK_STATUS.COMPLETE
        : completed === totalRegionsCount
          ? GET_STARTED_TASK_STATUS.COMPLETE
          : returnsSetUpInRegionsCount > 0
            ? GET_STARTED_TASK_STATUS.IN_PROGRESS
            : GET_STARTED_TASK_STATUS.NOT_STARTED;

    return {
      setUpReturnsStatus: calculatedStatus,
      setUpReturnsCounts: {
        returnsSetUpInRegionsCount,
        totalRegionsCount,
      },
    };
  }, [
    isLoadingSuggestedReturns,
    didErrorSuggestedReturns,
    dataSuggestedReturns,
    isLoadingFilingCalendarRequests,
    didErrorFilingCalendarRequests,
    dataFilingCalendarRequests,
  ]);
