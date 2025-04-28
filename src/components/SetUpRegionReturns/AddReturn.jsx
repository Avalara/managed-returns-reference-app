/*
 * Contents of this file was produced with a help of a code generation tool and
 * subsequently reviewed and edited by a human.
 *
 * While some of the code was created by an AI assisted service, manual adjustments
 * have been made to ensure correctness, readability, functionality and compliance
 * to Avalara's coding standards and guidelines.
 * Any future modifications should be approached with caution to avoid
 * overwriting the manual changes.
 *
 *
 * This source code is owned by Avalara Inc. Unauthorized copying of this file,
 * via any medium, is strictly prohibited. Proprietary and confidential.
 *
 * For more information, refer to the documentation or contact the development team.
 */

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Button,
  Select,
  Space,
  Typography,
  Alert,
  Divider,
  Skeleton,
  Modal,
} from 'antd';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import ReturnQuestion from './ReturnQuestion.jsx';
import { filingCalendarMetadata } from '../../graphql/queries/FilingCalendarMetadata.js';
import { companyLocations as COMPANY_LOCATIONS } from '../../graphql/queries/Companies.js';
import { useOutletContext, useParams } from 'react-router-dom';

const { Text } = Typography;

const FilingFrequency = ({
  formFilingFrequencies,
  selectedFilingFrequency,
}) => {
  const filingFrequencyOptions = formFilingFrequencies.reduce((acc, item) => {
    acc[item.filingFrequency] = item.filingPeriodDates;
    return acc;
  }, {});

  return (
    <>
      <Form.Item
        label="Filing Frequency"
        name="filingFrequency"
        rules={[
          { required: true, message: 'Please select a filing frequency' },
        ]}
      >
        <Select
          placeholder="Select filing frequency"
          style={{ width: '100%' }}
          size={'large'}
        >
          {Object.keys(filingFrequencyOptions)?.map((freq) => (
            <Select.Option key={freq} value={freq}>
              {freq}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Filing Period"
        name="filingPeriod"
        rules={[{ required: true, message: 'Please select a filing period' }]}
      >
        <Select
          placeholder="Select filing period"
          disabled={!selectedFilingFrequency}
          style={{ width: '100%' }}
          size={'large'}
        >
          {filingFrequencyOptions?.[selectedFilingFrequency]?.map(
            (period, index) => (
              <Select.Option key={index} value={period.description}>
                {period.description}
              </Select.Option>
            )
          )}
        </Select>
      </Form.Item>
    </>
  );
};

FilingFrequency.propTypes = {
  formFilingFrequencies: PropTypes.arrayOf(
    PropTypes.shape({
      filingFrequencyId: PropTypes.number,
      filingFrequency: PropTypes.string,
      filingPeriodDates: PropTypes.arrayOf(
        PropTypes.shape({
          transactionalPeriodEnd: PropTypes.string,
          transactionalPeriodStart: PropTypes.string,
          filingDueDate: PropTypes.string,
          description: PropTypes.string,
        })
      ),
    })
  ),
};

const AddReturn = ({ visible, onClose, taxForm }) => {
  const { companyId } = useOutletContext();
  const [form] = Form.useForm();
  const selectedFilingFrequency = Form.useWatch('filingFrequency', form);

  // Handle location selection
  const handleLocationSelect = (locationCode) => {
    const selectedLocation = locations.find(
      (loc) => loc.locationCode === locationCode
    );
    if (selectedLocation) {
      form.setFieldsValue({
        Line1: selectedLocation.line1,
        City: selectedLocation.city,
        Region: selectedLocation.region,
        PostalCode: selectedLocation.postalCode,
        Country: selectedLocation.country,
      });
    }
  };

  // Reset form when drawer opens with a new tax form
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  // Use the query hook to fetch questions
  const {
    loading: questionsLoading,
    error: questionsError,
    data: questionsData,
  } = useQuery(filingCalendarMetadata, {
    variables: { taxFormCode: taxForm?.taxFormCode },
  });

  const {
    loading: locationsLoading,
    error: locationsError,
    data: locationsData,
  } = useQuery(COMPANY_LOCATIONS, {
    variables: { companyId: parseInt(companyId) },
  });

  // Extract questions from the response
  const {
    customQuestions = [],
    standardQuestions = [],
    formFilingFrequencies = [],
    formHeader: { outletReportingMethod, region } = {},
  } = questionsData?.definitions?.value?.filingCalendarMetaData
    ?.filingCalendarMetadata || {};

  const locations = locationsData?.companies?.value?.[0]?.locations || [];

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        // setLoading(true);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Drawer
      title={
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <div>{`Set up ${taxForm?.description || 'Return'}`}</div>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {taxForm?.taxFormName || ''}
          </Text>
        </Space>
      }
      width={600}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to set up this return later?',
                content: `The information for this return won't be saved. To set up this return later, you will need to add it again to your ${region || 'state'} returns.`,
                okText: 'Yes, set up later',
                cancelText: 'Cancel',
                onOk: () => onClose(),
                footer: (_, { OkBtn, CancelBtn }) => (
                  <>
                    <CancelBtn />
                    <OkBtn />
                  </>
                ),
              });
            }}
          >
            Set up later
          </Button>
          <Button onClick={handleSubmit} type="primary">
            Save
          </Button>
        </Space>
      }
    >
      {questionsLoading || locationsLoading ? (
        <div style={{ padding: '50px 0' }}>
          <Skeleton
            active
            title={{ width: '50%' }}
            paragraph={{
              rows: 4,
              width: ['90%', '80%', '70%', '60%'],
            }}
          />
          <Skeleton
            active
            title={{ width: '40%' }}
            paragraph={{
              rows: 3,
              width: ['85%', '75%', '65%'],
            }}
            style={{ marginTop: 24 }}
          />
          <Skeleton
            active
            title={{ width: '50%' }}
            paragraph={{
              rows: 4,
              width: ['90%', '80%', '70%', '60%'],
            }}
          />
          <Skeleton
            active
            title={{ width: '40%' }}
            paragraph={{
              rows: 3,
              width: ['85%', '75%', '65%'],
            }}
            style={{ marginTop: 24 }}
          />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="returnSetupForm"
          wrapperCol={{ span: 16 }}
          initialValues={{}}
        >
          <Divider orientation="left" orientationMargin="0">
            State required information
          </Divider>
          {customQuestions.map((question) => (
            <ReturnQuestion key={question?.filingQuestionId} {...question} />
          ))}

          <FilingFrequency
            formFilingFrequencies={formFilingFrequencies}
            selectedFilingFrequency={selectedFilingFrequency}
          />
          {outletReportingMethod?.toUpperCase() === 'CONSOLIDATED' && (
            <>
              <Divider orientation="left" orientationMargin="0">
                Locations
              </Divider>
              <Alert
                description="All your locations will be consolidated to be filed in this return."
                type="info"
                showIcon
              />
            </>
          )}
          {/*{outletReportingMethod?.toUpperCase() === 'DUPLICATE' && (*/}
          {/*  <>*/}
          {/*    <Divider orientation="left" orientationMargin="0">*/}
          {/*      Locations*/}
          {/*    </Divider>*/}
          {/*    <Form.Item label={'Location'} name="locationCode">*/}
          {/*      <Select placeholder="Select location code" size={'large'}>*/}
          {/*        <Select.Option value={''}>All locations</Select.Option>*/}
          {/*        {locations.map((location) => (*/}
          {/*          <Select.Option*/}
          {/*            key={location.locationCode}*/}
          {/*            value={location.locationCode}*/}
          {/*          >*/}
          {/*            {location.description ||*/}
          {/*              `${location.line1}, ${location.city}`}*/}
          {/*          </Select.Option>*/}
          {/*        ))}*/}
          {/*      </Select>*/}
          {/*    </Form.Item>*/}
          {/*  </>*/}
          {/*)}*/}
          <Divider orientation="left" orientationMargin="0">
            Company details
          </Divider>
          {standardQuestions.map((question) => (
            <>
              {question?.value?.filingQuestionCode?.toUpperCase() ===
                'ADDRESSLINE1' && (
                <Form.Item label="Select address" name="address">
                  <Select
                    placeholder="Select a address"
                    onChange={handleLocationSelect}
                    allowClear={true}
                    style={{ width: '100%' }}
                    size={'large'}
                  >
                    {locations.map((location) => (
                      <Select.Option
                        key={location.locationCode}
                        value={location.locationCode}
                      >
                        {location.description ||
                          `${location.line1}, ${location.city}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <ReturnQuestion
                key={question.value.filingQuestionId}
                {...question.value}
              />
            </>
          ))}
        </Form>
      )}
    </Drawer>
  );
};

AddReturn.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  companyId: PropTypes.string,
  accountId: PropTypes.string,
  taxForm: PropTypes.shape({
    description: PropTypes.string,
    taxFormName: PropTypes.string,
    taxFormCode: PropTypes.string,
  }),
};

export default AddReturn;
