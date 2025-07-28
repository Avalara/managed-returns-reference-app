import { Table, Badge, Result, Button, Empty } from 'antd';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  companyRegionStatus as COMPANY_REGION_STATUS,
  filingCalendarRequests as FILING_CALENDAR_REQUESTS,
  regions as REGIONS,
  companySuggestedReturns as COMPANY_SUGGESTED_RETURNS,
} from '../../graphql/queries';

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_COUNTRY } from '../shared/Constants.js';

const SetUpReturnsTable = ({ companyId }) => {
  const navigate = useNavigate();

  // Fetch region status data
  const {
    loading: regionLoading,
    error: regionError,
    data: regionData,
  } = useQuery(COMPANY_REGION_STATUS, {
    variables: { companyId: parseInt(companyId) },
    skip: !companyId,
    fetchPolicy: 'network-only', // Don't use cache, fetch from network every time
  });

  // Fetch filing calendar requests data (both pending and approved)
  const {
    loading: filingCalendarRequestsLoading,
    error: filingCalendarRequestsError,
    data: filingCalendarRequestsData,
  } = useQuery(FILING_CALENDAR_REQUESTS, {
    variables: {
      companyId: parseInt(companyId),
      filter:
        "filingRequestStatusId eq 'CHANGEREQUEST' or filingRequestStatusId eq 'REQUESTAPPROVED'",
    },
    skip: !companyId,
    fetchPolicy: 'network-only', // Don't use cache, fetch from network every time
  });

  // Fetch definitions data for country and region names
  const {
    loading: definitionRegionsLoading,
    error: definitionRegionsError,
    data: definitionRegionsData,
  } = useQuery(REGIONS, {
    variables: { country: DEFAULT_COUNTRY },
  });

  // Fetch suggested returns data
  const {
    loading: suggestedReturnsLoading,
    error: suggestedReturnsError,
    data: suggestedReturnsData,
  } = useQuery(COMPANY_SUGGESTED_RETURNS, {
    variables: {
      companyId: parseInt(companyId),
      country: DEFAULT_COUNTRY,
    },
    skip: !companyId,
    fetchPolicy: 'network-only', // Don't use cache, fetch from network every time
  });

  // Create maps for country and region names from definitions query
  const { countryMap, regionMap } = useMemo(() => {
    const countryMap = {};
    const regionMap = {};

    if (definitionRegionsData?.definitions?.value?.countries) {
      const countries = definitionRegionsData.definitions.value.countries;

      countries.forEach((country) => {
        // Map country code to name
        countryMap[country.code] =
          country.name.charAt(0).toUpperCase() +
          country.name.slice(1).toLowerCase();

        regionMap[country.code] = {};

        // Map region codes to names for this country
        if (country.regions) {
          country.regions.forEach((region) => {
            regionMap[country.code][region.code] =
              region.name.charAt(0).toUpperCase() +
              region.name.slice(1).toLowerCase();
          });
        }
      });
    }

    return { countryMap, regionMap };
  }, [definitionRegionsData]);

  // Process the data to create the table data source
  const dataSource = useMemo(() => {
    // Get all regions with status from regionStatus query
    const currentRegions =
      regionData?.companies?.value?.[0]?.regionStatus || [];

    // Get suggested returns data
    const suggestedReturns =
      suggestedReturnsData?.companies?.value?.[0]?.suggestedTaxForms || [];

    // Get filing calendar requests data
    const filingCalendarRequests =
      filingCalendarRequestsData?.filingCalendarRequests?.value?.filingRequests
        ?.value || [];

    // Create a map of region codes to region objects
    const regionsMap = {};

    // Add regions from regionStatus to the map
    currentRegions.forEach((region) => {
      const regionCode = region.region;
      regionsMap[regionCode] = {
        regionCode,
        countryCode: region.country,
        status: 'NOTSTARTED',
        regionAdded: true,
        suggestedReturnsSetUpCount: 0,
        totalReturnsSetUpCount: 0,
        suggestedReturnsCount: 0,
      };
    });

    // Create a map of suggested tax form codes per region for faster lookup
    const regionSuggestedTaxForms = {};

    // Process suggested returns data to count suggested returns per region
    suggestedReturns.forEach((suggestedTaxForm) => {
      const regionCode = suggestedTaxForm.region;
      const suggestedReturnsCount =
        suggestedTaxForm.suggestedReturns?.length || 0;

      // Create set of suggested tax form codes for this region
      regionSuggestedTaxForms[regionCode] = new Set(
        suggestedTaxForm.suggestedReturns?.map((sr) => sr.taxFormCode) || []
      );

      if (!regionsMap[regionCode]) {
        return (regionsMap[regionCode] = {
          regionCode,
          countryCode: DEFAULT_COUNTRY,
          status: 'NOTSTARTED',
          regionAdded: false,
          suggestedReturnsSetUpCount: 0,
          totalReturnsSetUpCount: 0,
          suggestedReturnsCount: suggestedReturnsCount,
        });
      }

      regionsMap[regionCode].suggestedReturnsCount = suggestedReturnsCount;
    });

    // Process filing calendar requests data (both pending and approved)
    if (filingCalendarRequests) {
      // Track unique tax form codes per region
      const regionSuggestedTaxFormCodesSetUp = {};
      const regionAllTaxFormCodesSetUp = {};

      filingCalendarRequests.forEach((filingCalendarRequest) => {
        // Use region from the request data
        const regionCode = filingCalendarRequest.data.region;
        const countryCode = filingCalendarRequest.data.country;
        const taxFormCode = filingCalendarRequest.data.taxFormCode;

        // Initialize region if it doesn't exist
        if (!regionsMap[regionCode]) {
          regionsMap[regionCode] = {
            regionCode,
            countryCode,
            status: 'INPROGRESS',
            regionAdded: false,
            suggestedReturnsSetUpCount: 0,
            totalReturnsSetUpCount: 0,
            suggestedReturnsCount: 0,
          };
        }

        // Track all unique tax form codes set up for this region (Set ensures uniqueness)
        if (!regionAllTaxFormCodesSetUp[regionCode]) {
          regionAllTaxFormCodesSetUp[regionCode] = new Set();
        }
        regionAllTaxFormCodesSetUp[regionCode].add(taxFormCode);

        // Only count suggested tax forms set up separately
        const suggestedTaxFormsForRegion = regionSuggestedTaxForms[regionCode];
        if (
          suggestedTaxFormsForRegion &&
          suggestedTaxFormsForRegion.has(taxFormCode)
        ) {
          // Track unique suggested tax form codes set up for this region
          if (!regionSuggestedTaxFormCodesSetUp[regionCode]) {
            regionSuggestedTaxFormCodesSetUp[regionCode] = new Set();
          }
          regionSuggestedTaxFormCodesSetUp[regionCode].add(taxFormCode);
        }

        // Determine status based on suggested returns completion
        let status = 'INPROGRESS';
        const suggestedForCompletion = regionSuggestedTaxForms[regionCode];
        const allTaxFormsForRegion = regionAllTaxFormCodesSetUp[regionCode];

        if (suggestedForCompletion && allTaxFormsForRegion) {
          // Check if all suggested tax forms are present in all tax forms
          const allSuggestedCompleted = [...suggestedForCompletion].every(
            (suggestedCode) => allTaxFormsForRegion.has(suggestedCode)
          );
          if (allSuggestedCompleted && suggestedForCompletion.size > 0) {
            status = 'COMPLETED';
          }
        }

        // Update region with current status and maintain other properties
        regionsMap[regionCode] = {
          ...regionsMap[regionCode],
          status,
          suggestedReturnsSetUpCount:
            regionSuggestedTaxFormCodesSetUp[regionCode]?.size || 0,
          totalReturnsSetUpCount:
            regionAllTaxFormCodesSetUp[regionCode]?.size || 0,
        };
      });
    }

    // Convert regions map to array and map to table rows
    return Object.values(regionsMap).map((record) => ({
      ...record,
      id: `${record.countryCode}-${record.regionCode}`, // Add unique id for table rowKey
      countryName: countryMap?.[record.countryCode],
      regionName: regionMap?.[record.countryCode]?.[record.regionCode],
    }));
  }, [
    regionData,
    filingCalendarRequestsData,
    suggestedReturnsData,
    regionMap,
    countryMap,
  ]);

  if (
    regionError ||
    filingCalendarRequestsError ||
    definitionRegionsError ||
    suggestedReturnsError
  ) {
    return (
      <Result
        status="500"
        subTitle="We are having a momentary issue. Please try again in sometime."
      />
    );
  }

  const isLoading =
    regionLoading ||
    filingCalendarRequestsLoading ||
    definitionRegionsLoading ||
    suggestedReturnsLoading;

  const pagination = {
    pageSize: 10,
    showSizeChanger: true,
  };

  const columns = [
    {
      title: 'State',
      dataIndex: 'regionName',
      key: 'regionName',
      fixed: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description, region) =>
        region.regionAdded
          ? 'You collect tax here'
          : 'You have not added this region',
    },

    {
      title: 'Returns',
      dataIndex: 'totalReturnsSetUpCount',
      key: 'totalReturnsSetUpCount',
      render: (totalReturnsSetUpCount) =>
        `${totalReturnsSetUpCount} returns set up`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: 'Not started', value: 'NOTSTARTED' },
        { text: 'In progress', value: 'INPROGRESS' },
        { text: 'Completed', value: 'COMPLETED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => {
        let statusText;
        let status;
        switch (record.status) {
          case 'NOTSTARTED':
            status = 'warning';
            statusText = 'Not started';
            break;
          case 'INPROGRESS':
            status = 'processing';
            statusText = 'In progress';
            break;
          case 'COMPLETED':
            status = 'success';
            statusText = 'Completed';
            break;
          default:
            status = 'warning';
            statusText = 'Not started';
        }
        return <Badge status={status} text={statusText} />;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => {
        const { regionCode, regionName, countryCode } = record;
        return (
          <Button
            color="primary"
            variant="link"
            style={{ paddingLeft: 0 }}
            onClick={() =>
              navigate(
                `/returns/set-up-returns/${regionName}?regionCode=${regionCode}&countryCode=${countryCode}`
              )
            }
          >
            Set up returns
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      loading={isLoading}
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      locale={{
        emptyText: (
          <Empty description="No states found. Add states to get started."></Empty>
        ),
      }}
    />
  );
};

SetUpReturnsTable.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default SetUpReturnsTable;
