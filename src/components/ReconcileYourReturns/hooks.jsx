import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import { filings as FILINGS } from '../../graphql/queries';

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
  const { loading, error, data } = useQuery(FILINGS, {
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

  const flattenedData = useMemo(
    () =>
      !data
        ? []
        : extractTableData(data, {
            state: 'All',
            status: 'All',
          }),
    [data]
  );

  useEffect(() => {
    setAvailableStatuses(
      !flattenedData
        ? []
        : [
            ...new Set(
              flattenedData
                .filter((taxReturn) => !!taxReturn.status)
                .map((taxReturn) => taxReturn.status)
            ),
          ]
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
                .map((taxReturn) => taxReturn.state)
            ),
          ]
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
      (tr) => tr.status === 'PendingApproval'
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

  const regionData = data?.filings?.value[0]?.filingRegions.filter(
    (region) =>
      filters.state === 'All' || getRegionCode(filters.state) === region.region
  );

  return regionData;
}

function extractTableData(data, filters) {
  if (!data?.filings) return [];

  const taxReturns = data.filings.value.flatMap((filing) =>
    filing.filingRegions
      ?.filter(
        (region) =>
          filters.state === 'All' ||
          getRegionCode(filters.state) === region.region
      )
      .flatMap((region) =>
        region?.returns
          .filter(
            (taxReturn) =>
              filters.status === 'All' || filters.status === taxReturn.status
          )
          .map((taxReturn) => ({
            key: taxReturn.id,
            taxFormCode: taxReturn.formCode,
            state: getRegionName(region.region) || '',
            registrationId: taxReturn.registrationId,
            frequency: taxReturn.filingFrequency,
            grossSales: taxReturn.returnTaxSummary.reportableSalesAmount,
            netSales: taxReturn.returnTaxSummary.taxableAmount,
            exemptSales: taxReturn.returnTaxSummary.nonTaxableAmount,
            totalTax: taxReturn.returnTaxSummary.taxAmount,
            adjustments: taxReturn.totalAdjustments,
            amountDue: taxReturn.returnTaxSummary.remittanceAmount,
            status: taxReturn.status,
            country: region.country,
            regionCode: region.region,
            year: data?.filings?.value?.[0].year,
            month: data?.filings?.value?.[0].month,
          }))
      )
  );

  console.log('taxReturns', taxReturns);

  return taxReturns;
}

export { useFilingsData };
