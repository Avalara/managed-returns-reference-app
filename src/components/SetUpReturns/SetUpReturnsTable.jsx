import { Table, Badge, Result, Button, Empty } from 'antd';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  companyRegionStatus as COMPANY_REGION_STATUS,
  filingCalendarRequests as FILING_CALENDAR_REQUESTS,
  filingCalendars as FILING_CALENDARS,
  regions as REGIONS,
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

  // Fetch filing calendar requests data
  const {
    loading: filingCalendarRequestsLoading,
    error: filingCalendarRequestsError,
    data: filingCalendarRequestsData,
  } = useQuery(FILING_CALENDAR_REQUESTS, {
    variables: { companyId: parseInt(companyId) },
    skip: !companyId,
    fetchPolicy: 'network-only', // Don't use cache, fetch from network every time
  });

  // Fetch filing calendars data
  const {
    loading: filingCalendarsLoading,
    error: filingCalendarsError,
    data: filingCalendarsData,
  } = useQuery(FILING_CALENDARS, {
    variables: { companyId: parseInt(companyId) },
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

    // Create a map of region codes to region objects
    const regionsMap = {};

    // Add regions from regionStatus to the map
    currentRegions.forEach((region) => {
      const regionCode = region.region;
      regionsMap[regionCode] = {
        regionCode,
        countryCode: region.country,
        status: region.status,
        regionAdded: true,
        returnsCount: 0,
      };
    });

    // Process filing calendar requests data
    if (filingCalendarRequestsData) {
      // Process filing calendar requests
      const filingCalendarRequests =
        filingCalendarRequestsData?.filingCalendarRequests?.value
          ?.filingRequests?.value || [];
      filingCalendarRequests.forEach((filingCalendarRequest) => {
        // Use region if available, otherwise extract from taxFormCode
        const regionCode = filingCalendarRequest.data.region;
        const countryCode = filingCalendarRequest.data.country;

        const returnsCount = (regionsMap[regionCode]?.returnsCount || 0) + 1;
        regionsMap[regionCode] = {
          regionCode,
          countryCode,
          status: 'INPROGRESS',
          regionAdded: regionsMap[regionCode]?.regionAdded || false,
          returnsCount,
        };
      });
    }

    // Process filing calendars data
    if (filingCalendarsData) {
      // Process filing calendars
      const filingCalendarsItems =
        filingCalendarsData?.filingCalendars?.value?.filingCalendars?.value ||
        [];
      filingCalendarsItems.forEach((calendar) => {
        // For filingCalendars, we can only extract region from taxFormCode
        const regionCode = calendar.formRegion;
        const countryCode = calendar.formCountry;

        const returnsCount = (regionsMap[regionCode]?.returnsCount || 0) + 1;
        regionsMap[regionCode] = {
          regionCode,
          countryCode,
          status: 'INPROGRESS',
          regionAdded: regionsMap[regionCode]?.regionAdded || false,
          returnsCount,
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
    filingCalendarsData,
    regionMap,
    countryMap,
  ]);

  if (
    regionError ||
    filingCalendarRequestsError ||
    filingCalendarsError ||
    definitionRegionsError
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
    filingCalendarsLoading ||
    definitionRegionsLoading;

  const pagination = {
    pageSize: 10,
    showSizeChanger: true,
  };

  const columns = [
    {
      title: 'State',
      dataIndex: 'regionName',
      key: 'regionName',
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
      dataIndex: 'returnsCount',
      key: 'returnsCount',
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
      render: (_, record) => {
        const { regionCode, regionName, countryCode } = record;
        return (
          <Button
            color="primary"
            variant="link"
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
