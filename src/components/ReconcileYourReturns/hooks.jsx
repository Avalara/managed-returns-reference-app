import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import queries from '../../graphql/queries';

import { getRegionCode, getRegionName } from '../shared/USRegions';

function useFilingsData({
  companyId,
  year,
  month,
  country,
  region,
  setAmountDue = () => {},
  setReturnCount = () => {},
  filters = { state: 'All', status: 'All' },
  setAvailableStates = () => {},
  setAvailableStatuses = () => {},
}) {
  const { loading, error, data } = useQuery(queries.filings, {
    variables: {
      companyId: parseInt(companyId),
      year,
      month,
      country,
      region,
    },
  });

  // console.log('data', data);

  useEffect(() => {
    setAmountDue(data?.filings?.value?.[0]?.taxSummary?.remittanceAmount);
  }, [data, setAmountDue]);

  const flattenedData = useMemo(() => {
    return !data
      ? []
      : extractTableData(data, {
          state: 'All',
          status: 'All',
        });
  }, [data]);

  useEffect(() => {
    setAvailableStatuses(
      !flattenedData
        ? []
        : [
            ...new Set(
              flattenedData
                .filter((taxReturn) => !!taxReturn.status)
                .map((taxReturn) => taxReturn.status),
            ),
          ],
    );
  }, [flattenedData, setAvailableStatuses]);

  useEffect(() => {
    setAvailableStates(
      !flattenedData
        ? []
        : [
            ...new Set(
              flattenedData
                .filter((taxReturn) => !!taxReturn.state)
                .map((taxReturn) => taxReturn.state),
            ),
          ],
    );
  }, [flattenedData, setAvailableStates]);

  const tableData = useMemo(() => {
    if (data) return extractTableData(data, filters);
  }, [data, filters]);

  const tileData = useMemo(() => {
    if (data) return extractTileData(data, filters);
  }, [data, filters]);

  useEffect(() => {
    const returnsToApprove = flattenedData.filter(
      (tr) => tr.status === 'PendingApproval',
    );
    setReturnCount(returnsToApprove.length);
  }, [flattenedData, setReturnCount]);

  return {
    loading,
    error,
    tableData,
    tileData,
  };
}

function extractTileData(data, filters) {
  if (!data?.filings) return [];

  const regionData = data?.filings?.value[0]?.filingRegions.filter((region) => {
    return (
      filters.state === 'All' || getRegionCode(filters.state) === region.region
    );
  });

  return regionData;
}

function extractTableData(data, filters) {
  if (!data?.filings) return [];

  const taxReturns = data.filings.value.flatMap((filing) =>
    filing.filingRegions
      ?.filter((region) => {
        return (
          filters.state === 'All' ||
          getRegionCode(filters.state) === region.region
        );
      })
      .flatMap((region) => {
        return region?.returns
          .filter(
            (taxReturn) =>
              filters.status === 'All' || filters.status === taxReturn.status,
          )
          .map((taxReturn) => {
            return {
              key: taxReturn.id,
              taxFormCode: taxReturn.formCode,
              state: getRegionName(region.region) || '',
              registrationId: taxReturn.registrationId,
              frequency: taxReturn.filingFrequency,
              totalSales: taxReturn.returnTaxSummary.reportableSalesAmount,
              taxableSales: taxReturn.returnTaxSummary.taxableAmount,
              totalTax: taxReturn.returnTaxSummary.taxAmount,
              adjustments: taxReturn.totalAdjustments,
              amountDue: taxReturn.returnTaxSummary.remittanceAmount,
              status: taxReturn.status,
              country: region.country,
              regionCode: region.region,
              year: data?.filings?.value?.[0].year,
              month: data?.filings?.value?.[0].month,
            };
          });
      }),
  );

  console.log('taxReturns', taxReturns);

  return taxReturns;
}

/* ListFilings - query is to be deprecated, as it hits compliance-service apis */
function useListFilingsData({
  companyId,
  year,
  month,
  country,
  setAmountDue,
  setReturnCount,
  filters,
  setAvailableStates,
  setAvailableStatuses,
}) {
  const { loading, error, data } = useQuery(queries.listFilings, {
    variables: {
      companyId,
      year: '' + year,
      month: '' + month,
      country,
    },
  });

  useEffect(() => {
    setAmountDue(data?.ListFilings?.value?.[0]?.taxSummary?.remittanceAmount);
  }, [data, setAmountDue]);

  const flattenedData = useMemo(() => {
    return !data
      ? []
      : datasourceTranslationListFilings(data, {
          state: 'All',
          status: 'All',
        });
  }, [data]);

  useEffect(() => {
    setAvailableStatuses(
      !flattenedData
        ? []
        : [...new Set(flattenedData.map((taxReturn) => taxReturn.status))],
    );
  }, [flattenedData, setAvailableStatuses]);

  useEffect(() => {
    setAvailableStates(
      !flattenedData
        ? []
        : [...new Set(flattenedData.map((taxReturn) => taxReturn.state))],
    );
  }, [flattenedData, setAvailableStates]);

  const tableData = useMemo(() => {
    if (data) return datasourceTranslationListFilings(data, filters);
  }, [data, filters]);

  const tileData = useMemo(() => {
    if (data) return tileDataTranslationListFilings(data, filters);
  }, [data, filters]);

  useEffect(() => {
    if (data) {
      const flattenedReturns = data?.ListFilings?.value.flatMap((filing) =>
        filing.filingRegions.flatMap((region) => {
          return region?.returns;
        }),
      );

      const returnsToApprove = flattenedReturns.filter(
        (tr) => tr.status === 'PendingApproval',
      );
      setReturnCount(returnsToApprove.length);
    }
  }, [data, setReturnCount]);

  return {
    loading,
    error,
    tableData,
    tileData,
  };
}

function tileDataTranslationListFilings(data, filters) {
  if (!data?.ListFilings) return [];
  const regionData = data?.ListFilings?.value[0]?.filingRegions.filter(
    (region) => {
      return (
        filters.state === 'All' ||
        getRegionCode(filters.state) === region.region
      );
    },
  );

  return regionData;
}

function datasourceTranslationListFilings(data, filters) {
  if (!data?.ListFilings) return [];

  const taxReturns = data?.ListFilings?.value?.flatMap((filing) =>
    filing?.filingRegions
      ?.filter((region) => {
        return (
          filters.state === 'All' ||
          getRegionCode(filters.state) === region.region
        );
      })
      .flatMap((region) => {
        return region?.returns
          .filter(
            (taxReturn) =>
              filters.status === 'All' || filters.status === taxReturn.status,
          )
          .map((taxReturn) => {
            return {
              key: taxReturn.id,
              taxFormCode: taxReturn.formCode,
              state: getRegionName(region.region) || '',
              registrationId: taxReturn.registrationId,
              frequency: taxReturn.filingFrequency,
              totalSales: taxReturn.returnTaxSummary.reportableSalesAmount,
              taxableSales: taxReturn.returnTaxSummary.taxableAmount,
              totalTax: taxReturn.returnTaxSummary.taxAmount,
              adjustments: taxReturn.totalAdjustments,
              amountDue: taxReturn.returnTaxSummary.remittanceAmount,
              status: taxReturn.status,
              country: region.country,
              regionCode: region.region,
              year: data?.ListFilings?.value?.year,
              month: data?.ListFilings?.value?.month,
            };
          });
      }),
  );

  return taxReturns;
}

export { useFilingsData, useListFilingsData };
