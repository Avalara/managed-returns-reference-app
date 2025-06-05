import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  Button,
  Row,
  Col,
  Space,
  Spin,
  message,
  Result,
  Divider,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  regions as REGIONS,
  companyRegionStatus as COMPANY_REGION_STATUS,
} from '../../graphql/queries';
import { updateRegionStatus as UPDATE_REGION_STATUS } from '../../graphql/mutations';
import { DEFAULT_COUNTRY } from '../shared/Constants.js';
import PropTypes from 'prop-types';

const SelectStatesEdit = ({ companyId }) => {
  const navigate = useNavigate();

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [existingSelectedRegions, setExistingSelectedRegions] = useState([]);
  const [regions, setRegions] = useState([]);

  // Fetch all regions
  const {
    loading: regionsLoading,
    error: regionsError,
    data: regionsData,
  } = useQuery(REGIONS, {
    variables: { country: DEFAULT_COUNTRY },
  });

  // Fetch user's region status
  const {
    loading: companyRegionsLoading,
    error: companyRegionsError,
    data: companyRegionsData,
  } = useQuery(COMPANY_REGION_STATUS, {
    variables: { companyId: parseInt(companyId) },
    skip: !companyId,
  });

  // Update region status mutation
  const [updateCompanyRegions, { loading: updatingCompanyRegions }] =
    useMutation(UPDATE_REGION_STATUS, {
      onCompleted: () => {
        message.success('Regions successfully added');
        // Navigate back to set-up-returns after successful update
        navigate('/returns/set-up-returns');
      },
      onError: (error) => {
        message.error(`Error adding regions: ${error.message}`);
      },
    });

  // Process regions data when it arrives
  useEffect(() => {
    if (regionsData?.definitions?.value?.countries) {
      setRegions(regionsData.definitions.value.countries[0]?.regions || []);
    }
  }, [regionsData]);

  // Set selected states based on region status data
  useEffect(() => {
    if (companyRegionsData?.companies?.value?.[0]?.regionStatus) {
      const existingRegionCodes =
        companyRegionsData.companies.value[0].regionStatus.map(
          (region) => region.region
        );

      setExistingSelectedRegions(existingRegionCodes);
    }
  }, [companyRegionsData]);

  const handleRegionChange = (stateCode, checked) => {
    // If a state is checked, add it to the selectedRegions array
    if (checked) {
      setSelectedRegions((prevStates) => [...prevStates, stateCode]);
    }
  };

  const handleNext = () => {
    if (selectedRegions.length > 0) {
      // Create an array of input objects for newly selected states
      const selectedRegionsInputArray = selectedRegions.map((regionCode) => ({
        country: DEFAULT_COUNTRY,
        region: regionCode,
        status: 'NOTSTARTED',
      }));

      // Update all newly selected regions at once
      updateCompanyRegions({
        variables: {
          companyId: parseInt(companyId),
          input: selectedRegionsInputArray,
        },
      });
    } else {
      message.error('Please select at least one state');
    }
  };

  const handleCancel = () => {
    navigate('/returns/set-up-returns');
  };

  // Show loading state while data is being fetched
  const isLoading = regionsLoading || companyRegionsLoading;
  const hasError = regionsError || companyRegionsError;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (hasError) {
    return (
      <Result
        status="500"
        subTitle="We are having a momentary issue, please try again in some time."
      />
    );
  }

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          {regions.map((region) => {
            const isExistingSelectedRegion = existingSelectedRegions.includes(
              region.code
            );
            const isSelected = selectedRegions.includes(region.code);

            return (
              <Col span={8} key={region.code}>
                <Checkbox
                  onChange={(e) =>
                    handleRegionChange(region.code, e.target.checked)
                  }
                  checked={isSelected || isExistingSelectedRegion}
                  disabled={isExistingSelectedRegion || updatingCompanyRegions}
                >
                  {region.name}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      </Space>
      <Divider />
      <Space>
        <Button
          type="primary"
          onClick={handleNext}
          loading={updatingCompanyRegions}
          disabled={selectedRegions.length === 0}
        >
          Next
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Space>
    </>
  );
};

SelectStatesEdit.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default SelectStatesEdit;
